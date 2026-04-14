const { Plugin, PluginSettingTab, Setting, Notice } = require("obsidian");
const { EditorView } = require("@codemirror/view");
const { Annotation, Transaction } = require("@codemirror/state");
const { syntaxTree } = require("@codemirror/language");

const { resolveLocale, translate } = require("./i18n");
const {
	clamp,
	isWhitespace,
	nodeToElement,
	normalizeColorToHex,
	normalizeLatexColorToken,
	parseTopLevelColorWrapper
} = require("./latex-utils");

const SYNC_ANNOTATION = Annotation.define();
const EXCLUDED_NODE_PATTERN = /(Code|FencedCode|CodeBlock|InlineCode|CodeText|FrontMatter|YAML|Html|HTML)/i;
const MATH_BEGIN_MARK_PATTERN = /formatting-math-begin/i;
const MATH_END_MARK_PATTERN = /formatting-math-end/i;
const EMBEDDED_COLOR_PATTERN = /\\(?:textcolor|color)\s*\{/;

const DEFAULT_SETTINGS = {
	language: "auto",
	autoSyncOnEnter: true,
	processPreviousLineOnEnter: true,
	preferDomColor: true,
	overwriteExistingColor: true,
	skipEmbeddedColorFormula: true,
	showNoticeAfterManualSync: true
};

const ROLE_TO_CSS_VARIABLES = {
	heading1: ["--h1-color", "--text-title-h1", "--text-normal"],
	heading2: ["--h2-color", "--text-title-h2", "--text-normal"],
	heading3: ["--h3-color", "--text-title-h3", "--text-normal"],
	heading4: ["--h4-color", "--text-title-h4", "--text-normal"],
	heading5: ["--h5-color", "--text-title-h5", "--text-normal"],
	heading6: ["--h6-color", "--text-title-h6", "--text-normal"],
	strong: ["--bold-color", "--text-strong", "--text-normal"],
	emphasis: ["--italic-color", "--text-muted", "--text-normal"],
	link: ["--link-color", "--text-accent", "--color-accent", "--text-normal"],
	quote: ["--blockquote-color", "--text-muted", "--text-normal"],
	code: ["--code-normal", "--text-muted", "--text-normal"],
	list: ["--text-normal"],
	default: ["--text-normal"]
};

module.exports = class LatexColorSyncPlugin extends Plugin {
	async onload() {
		await this.loadSettings();
		this.isApplyingChanges = false;
		this.refreshLocale();

		this.registerCommands();

		this.registerEditorExtension(
			EditorView.updateListener.of((update) => {
				this.onEditorUpdate(update);
			})
		);

		this.addSettingTab(new LatexColorSyncSettingTab(this.app, this));
	}

	async loadSettings() {
		const saved = await this.loadData();
		this.settings = Object.assign({}, DEFAULT_SETTINGS, saved || {});
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	refreshLocale() {
		this.locale = resolveLocale(this.settings.language);
	}

	t(key, variables) {
		return translate(this.locale, key, variables);
	}

	registerCommands() {
		this.addCommand({
			id: "sync-latex-color-selection-or-current-line",
			name: this.t("command.syncSelectionApply"),
			editorCallback: (editor) => {
				this.runManualCommand(editor, "selection");
			}
		});

		this.addCommand({
			id: "sync-latex-color-current-document",
			name: this.t("command.syncDocumentApply"),
			editorCallback: (editor) => {
				this.runManualCommand(editor, "document");
			}
		});
	}

	runManualCommand(editor, scope) {
		const view = this.getEditorView(editor);
		if (!view) {
			new Notice(this.t("notice.cannotAccessEditorView"));
			return;
		}

		const targetLineNumbers = scope === "document" ? this.getAllLineNumbers(view.state) : this.getLineNumbersFromSelection(view.state);
		const summary = this.syncLinesInView(view, targetLineNumbers);
		if (this.settings.showNoticeAfterManualSync) {
			new Notice(this.formatManualSummary(summary));
		}
	}

	formatManualSummary(summary) {
		if (summary.changedLines <= 0) {
			return this.t("notice.noChanges", {
				lineCount: summary.targetLines,
				formulaCount: summary.scannedFormulas
			});
		}

		return `${this.t("notice.applySummary", {
			lineCount: summary.changedLines,
			formulaCount: summary.changedFormulas
		})} ${this.t("notice.undoHint")}`;
	}

	onEditorUpdate(update) {
		if (!this.settings.autoSyncOnEnter) {
			return;
		}
		if (!update.docChanged || this.isApplyingChanges) {
			return;
		}
		if (update.transactions.some((tr) => tr.annotation(SYNC_ANNOTATION))) {
			return;
		}
		if (!this.containsNewlineInsertion(update.transactions)) {
			return;
		}

		const lineSet = new Set();
		for (const range of update.state.selection.ranges) {
			const currentLine = update.state.doc.lineAt(range.head).number;
			lineSet.add(currentLine);
			if (this.settings.processPreviousLineOnEnter && currentLine > 1) {
				lineSet.add(currentLine - 1);
			}
		}

		if (lineSet.size === 0) {
			return;
		}
		this.syncLinesInView(update.view, Array.from(lineSet));
	}

	containsNewlineInsertion(transactions) {
		for (const tr of transactions) {
			if (!tr.docChanged) {
				continue;
			}
			let hasNewline = false;
			tr.changes.iterChanges((_fromA, _toA, _fromB, _toB, inserted) => {
				if (!hasNewline && inserted.toString().includes("\n")) {
					hasNewline = true;
				}
			});
			if (hasNewline) {
				return true;
			}
		}
		return false;
	}

	getEditorView(editor) {
		const maybeView = editor && editor.cm;
		if (maybeView && typeof maybeView.dispatch === "function" && maybeView.state && maybeView.domAtPos) {
			return maybeView;
		}
		return null;
	}

	getAllLineNumbers(state) {
		const lines = [];
		for (let i = 1; i <= state.doc.lines; i += 1) {
			lines.push(i);
		}
		return lines;
	}

	getLineNumbersFromSelection(state) {
		const lineSet = new Set();
		for (const range of state.selection.ranges) {
			const start = state.doc.lineAt(range.from).number;
			const end = state.doc.lineAt(range.to).number;
			for (let i = start; i <= end; i += 1) {
				lineSet.add(i);
			}
		}
		if (lineSet.size === 0) {
			lineSet.add(state.doc.lineAt(state.selection.main.head).number);
		}
		return Array.from(lineSet);
	}

	syncLinesInView(view, lineNumbers) {
		const unique = Array.from(
			new Set(
				lineNumbers
					.map((n) => Number(n))
					.filter((n) => Number.isFinite(n) && n >= 1 && n <= view.state.doc.lines)
			)
		).sort((a, b) => a - b);

		const summary = {
			targetLines: unique.length,
			changedLines: 0,
			scannedFormulas: 0,
			changedFormulas: 0
		};

		if (unique.length === 0) {
			return summary;
		}

		const state = view.state;
		const changes = [];

		for (const lineNumber of unique) {
			const line = state.doc.line(lineNumber);
			const lineResult = this.syncLatexInLine(view, state, line);
			summary.scannedFormulas += lineResult.scannedFormulas;
			summary.changedFormulas += lineResult.changedFormulas;
			if (lineResult.text !== line.text) {
				changes.push({ from: line.from, to: line.to, insert: lineResult.text });
				summary.changedLines += 1;
			}
		}

		if (changes.length === 0) {
			return summary;
		}

		this.isApplyingChanges = true;
		try {
			view.dispatch({
				changes,
				annotations: [SYNC_ANNOTATION.of(true), Transaction.userEvent.of("input.latex-color-sync")]
			});
		} finally {
			this.isApplyingChanges = false;
		}

		return summary;
	}

	syncLatexInLine(view, state, line) {
		if (!line.text.includes("$")) {
			return { text: line.text, scannedFormulas: 0, changedFormulas: 0 };
		}
		if (this.isExcludedLine(state, line)) {
			return { text: line.text, scannedFormulas: 0, changedFormulas: 0 };
		}

		const mathSpans = this.findMathSpansInLine(state, line);
		if (mathSpans.length === 0) {
			return { text: line.text, scannedFormulas: 0, changedFormulas: 0 };
		}

		let out = "";
		let cursor = 0;
		let changed = false;
		let changedFormulas = 0;

		for (const span of mathSpans) {
			out += line.text.slice(cursor, span.startOffset);

			const original = line.text.slice(span.startOffset, span.endOffset);
			const content = line.text.slice(span.contentStartOffset, span.contentEndOffset);
			const color = this.resolveTargetColor(view, state, line, span);

			if (!color) {
				out += original;
				cursor = span.endOffset;
				continue;
			}

			const rewrittenContent = this.rewriteMathContent(content, color);
			if (rewrittenContent === content) {
				out += original;
			} else {
				out += `${span.delimiter}${rewrittenContent}${span.delimiter}`;
				changed = true;
				changedFormulas += 1;
			}

			cursor = span.endOffset;
		}

		out += line.text.slice(cursor);
		return {
			text: changed ? out : line.text,
			scannedFormulas: mathSpans.length,
			changedFormulas
		};
	}

	isExcludedLine(state, line) {
		const startPos = line.from;
		const endPos = Math.max(line.from, line.to - 1);
		return this.hasExcludedAncestor(state, startPos) || this.hasExcludedAncestor(state, endPos);
	}

	hasExcludedAncestor(state, pos) {
		const tree = syntaxTree(state);
		const node = tree.resolve(pos, 1);
		for (let current = node; current; current = current.parent) {
			if (EXCLUDED_NODE_PATTERN.test(current.name)) {
				return true;
			}
		}
		return false;
	}

	findMathSpansInLine(state, line) {
		const markers = [];
		const tree = syntaxTree(state);
		tree.iterate({
			from: line.from,
			to: line.to,
			enter: (node) => {
				if (node.from < line.from || node.to > line.to) {
					return;
				}

				const nodeName = node.type.name || node.name || "";
				const isBegin = MATH_BEGIN_MARK_PATTERN.test(nodeName);
				const isEnd = MATH_END_MARK_PATTERN.test(nodeName);
				if (!isBegin && !isEnd) {
					return;
				}

				const raw = state.doc.sliceString(node.from, node.to);
				if (raw !== "$" && raw !== "$$") {
					return;
				}

				markers.push({
					kind: isBegin ? "begin" : "end",
					from: node.from,
					to: node.to,
					delimiter: raw
				});
			}
		});

		if (markers.length < 2) {
			return [];
		}

		markers.sort((a, b) => a.from - b.from || a.to - b.to);

		const spans = [];
		const stack = [];
		for (const marker of markers) {
			if (marker.kind === "begin") {
				stack.push(marker);
				continue;
			}

			for (let i = stack.length - 1; i >= 0; i -= 1) {
				const open = stack[i];
				if (open.delimiter !== marker.delimiter) {
					continue;
				}
				stack.splice(i, 1);

				const startOffset = open.from - line.from;
				const endOffset = marker.to - line.from;
				const contentStartOffset = open.to - line.from;
				const contentEndOffset = marker.from - line.from;
				if (contentEndOffset <= contentStartOffset) {
					break;
				}

				spans.push({
					startOffset,
					endOffset,
					contentStartOffset,
					contentEndOffset,
					delimiter: open.delimiter
				});
				break;
			}
		}

		return this.deduplicateMathSpans(spans);
	}

	deduplicateMathSpans(spans) {
		if (spans.length <= 1) {
			return spans;
		}

		const unique = [];
		const seen = new Set();
		const sorted = spans.slice().sort((a, b) => a.startOffset - b.startOffset || a.endOffset - b.endOffset);
		for (const span of sorted) {
			const key = `${span.startOffset}:${span.endOffset}`;
			if (seen.has(key)) {
				continue;
			}
			const last = unique.length > 0 ? unique[unique.length - 1] : null;
			if (last && span.startOffset < last.endOffset) {
				if (span.endOffset <= last.endOffset) {
					continue;
				}
				unique[unique.length - 1] = span;
				seen.add(key);
				continue;
			}
			seen.add(key);
			unique.push(span);
		}
		return unique;
	}

	resolveTargetColor(view, state, line, span) {
		const strategies = this.settings.preferDomColor ? ["dom", "syntax"] : ["syntax", "dom"];
		const anchorPos = line.from + this.getPrimaryProbeOffset(line.text, span);
		const lineElement = this.getLineElementAtPos(view, anchorPos);

		for (const strategy of strategies) {
			if (strategy === "dom") {
				const domColor = this.resolveColorFromDom(view, line, span);
				if (domColor) {
					return domColor;
				}
			}
			if (strategy === "syntax") {
				const roleColor = this.resolveColorFromSyntaxRole(view, state, line, span, lineElement);
				if (roleColor) {
					return roleColor;
				}
			}
		}

		const fallbackFromLine = this.getComputedElementColor(lineElement);
		if (fallbackFromLine) {
			return fallbackFromLine;
		}
		return this.resolveCssVariableColor("--text-normal", lineElement);
	}

	resolveColorFromDom(view, line, span) {
		for (const offset of this.getProbeOffsets(line.text, span)) {
			const color = this.getDomColorAtPos(view, line.from + offset);
			if (color) {
				return color;
			}
		}
		return null;
	}

	resolveColorFromSyntaxRole(view, state, line, span, anchorElement) {
		const role = this.inferSyntaxRole(state, line.from + this.getPrimaryProbeOffset(line.text, span));
		const candidates = ROLE_TO_CSS_VARIABLES[role] || ROLE_TO_CSS_VARIABLES.default;
		for (const variableName of candidates) {
			const color = this.resolveCssVariableColor(variableName, anchorElement || view.dom);
			if (color) {
				return color;
			}
		}
		return null;
	}

	inferSyntaxRole(state, pos) {
		const tree = syntaxTree(state);
		const node = tree.resolve(pos, 1);
		const names = [];
		for (let current = node; current; current = current.parent) {
			names.push(current.name);
		}
		const has = (pattern) => names.some((name) => pattern.test(name));

		if (has(/ATXHeading1|SetextHeading1|Heading1|Header1/i)) return "heading1";
		if (has(/ATXHeading2|SetextHeading2|Heading2|Header2/i)) return "heading2";
		if (has(/ATXHeading3|Heading3|Header3/i)) return "heading3";
		if (has(/ATXHeading4|Heading4|Header4/i)) return "heading4";
		if (has(/ATXHeading5|Heading5|Header5/i)) return "heading5";
		if (has(/ATXHeading6|Heading6|Header6/i)) return "heading6";
		if (has(/Strong|StrongEmphasis|Bold/i)) return "strong";
		if (has(/Emphasis|Italic/i)) return "emphasis";
		if (has(/Link|URL|Autolink|WikiLink/i)) return "link";
		if (has(/Quote|Blockquote/i)) return "quote";
		if (has(/Code|CodeText|InlineCode|FencedCode|CodeBlock/i)) return "code";
		if (has(/List|Bullet|Ordered/i)) return "list";
		return "default";
	}

	getPrimaryProbeOffset(text, span) {
		const probes = this.getProbeOffsets(text, span);
		return probes.length > 0 ? probes[0] : 0;
	}

	getProbeOffsets(text, span) {
		const offsets = [];
		const add = (value) => {
			if (value >= 0 && value <= text.length && !offsets.includes(value)) {
				offsets.push(value);
			}
		};

		for (let i = span.startOffset - 1; i >= 0; i -= 1) {
			if (!isWhitespace(text[i])) {
				add(i);
				break;
			}
		}

		for (let i = span.endOffset; i < text.length; i += 1) {
			if (!isWhitespace(text[i])) {
				add(i);
				break;
			}
		}

		for (let i = 0; i < text.length; i += 1) {
			if (!isWhitespace(text[i]) && (i < span.startOffset || i >= span.endOffset)) {
				add(i);
				break;
			}
		}

		add(0);
		return offsets;
	}

	getLineElementAtPos(view, pos) {
		let domInfo;
		try {
			domInfo = view.domAtPos(clamp(pos, 0, view.state.doc.length));
		} catch (_error) {
			return null;
		}
		let el = nodeToElement(domInfo.node);
		while (el && !el.classList.contains("cm-line")) {
			el = el.parentElement;
		}
		return el;
	}

	getDomColorAtPos(view, pos) {
		let domInfo;
		try {
			domInfo = view.domAtPos(clamp(pos, 0, view.state.doc.length));
		} catch (_error) {
			return null;
		}

		let el = nodeToElement(domInfo.node);
		while (el) {
			const color = this.getComputedElementColor(el);
			if (color) {
				return color;
			}
			if (el.classList.contains("cm-editor")) {
				break;
			}
			el = el.parentElement;
		}
		return null;
	}

	getComputedElementColor(el) {
		if (!el) {
			return null;
		}
		const raw = getComputedStyle(el).color;
		return normalizeColorToHex(raw, el);
	}

	resolveCssVariableColor(variableName, anchorElement) {
		const rawValue = this.lookupCssVariable(variableName, anchorElement);
		if (!rawValue) {
			return null;
		}
		return this.resolveColorExpression(rawValue, anchorElement, 0);
	}

	lookupCssVariable(variableName, anchorElement) {
		const visited = new Set();
		for (const el of [anchorElement, document.body, document.documentElement]) {
			if (!el || visited.has(el)) {
				continue;
			}
			visited.add(el);
			const value = getComputedStyle(el).getPropertyValue(variableName).trim();
			if (value) {
				return value;
			}
		}
		return null;
	}

	resolveColorExpression(expression, anchorElement, depth) {
		if (!expression || depth > 5) {
			return null;
		}
		const trimmed = expression.trim();
		if (!trimmed) {
			return null;
		}

		const variableMatch = trimmed.match(/^var\(\s*(--[A-Za-z0-9-_]+)\s*(?:,\s*(.+))?\)$/);
		if (variableMatch) {
			const nested = this.lookupCssVariable(variableMatch[1], anchorElement);
			if (nested && nested !== trimmed) {
				const resolvedNested = this.resolveColorExpression(nested, anchorElement, depth + 1);
				if (resolvedNested) {
					return resolvedNested;
				}
			}
			if (variableMatch[2]) {
				return this.resolveColorExpression(variableMatch[2], anchorElement, depth + 1);
			}
			return null;
		}

		return normalizeColorToHex(trimmed, anchorElement);
	}

	rewriteMathContent(content, targetColorHex) {
		const wrapper = parseTopLevelColorWrapper(content);
		if (wrapper) {
			if (!this.settings.overwriteExistingColor) {
				return content;
			}
			if (normalizeLatexColorToken(wrapper.color) === normalizeLatexColorToken(targetColorHex)) {
				return content;
			}
			return `${wrapper.leading}\\textcolor{${targetColorHex}}{${wrapper.inner}}${wrapper.trailing}`;
		}

		if (this.settings.skipEmbeddedColorFormula && EMBEDDED_COLOR_PATTERN.test(content)) {
			return content;
		}
		return `\\textcolor{${targetColorHex}}{${content}}`;
	}
};

class LatexColorSyncSettingTab extends PluginSettingTab {
	constructor(app, plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: this.plugin.t("settings.sectionGeneral") });

		new Setting(containerEl)
			.setName(this.plugin.t("settings.language.name"))
			.setDesc(this.plugin.t("settings.language.desc"))
			.addDropdown((dropdown) => {
				dropdown.addOption("auto", this.plugin.t("settings.language.optionAuto"));
				dropdown.addOption("en", this.plugin.t("settings.language.optionEnglish"));
				dropdown.addOption("zh-CN", this.plugin.t("settings.language.optionChinese"));
				dropdown.setValue(this.plugin.settings.language || "auto").onChange(async (value) => {
					this.plugin.settings.language = value;
					this.plugin.refreshLocale();
					await this.plugin.saveSettings();
					this.display();
					new Notice(this.plugin.t("notice.languageChanged"));
				});
			});

		new Setting(containerEl)
			.setName(this.plugin.t("settings.showNoticeAfterManualSync.name"))
			.setDesc(this.plugin.t("settings.showNoticeAfterManualSync.desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.showNoticeAfterManualSync).onChange(async (value) => {
					this.plugin.settings.showNoticeAfterManualSync = value;
					await this.plugin.saveSettings();
				})
			);

		containerEl.createEl("h2", { text: this.plugin.t("settings.sectionBehavior") });

		new Setting(containerEl)
			.setName(this.plugin.t("settings.autoSyncOnEnter.name"))
			.setDesc(this.plugin.t("settings.autoSyncOnEnter.desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.autoSyncOnEnter).onChange(async (value) => {
					this.plugin.settings.autoSyncOnEnter = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName(this.plugin.t("settings.processPreviousLineOnEnter.name"))
			.setDesc(this.plugin.t("settings.processPreviousLineOnEnter.desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.processPreviousLineOnEnter).onChange(async (value) => {
					this.plugin.settings.processPreviousLineOnEnter = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName(this.plugin.t("settings.preferDomColor.name"))
			.setDesc(this.plugin.t("settings.preferDomColor.desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.preferDomColor).onChange(async (value) => {
					this.plugin.settings.preferDomColor = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName(this.plugin.t("settings.overwriteExistingColor.name"))
			.setDesc(this.plugin.t("settings.overwriteExistingColor.desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.overwriteExistingColor).onChange(async (value) => {
					this.plugin.settings.overwriteExistingColor = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName(this.plugin.t("settings.skipEmbeddedColorFormula.name"))
			.setDesc(this.plugin.t("settings.skipEmbeddedColorFormula.desc"))
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.skipEmbeddedColorFormula).onChange(async (value) => {
					this.plugin.settings.skipEmbeddedColorFormula = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
