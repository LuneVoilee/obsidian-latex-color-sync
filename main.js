var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/i18n.js
var require_i18n = __commonJS({
  "src/i18n.js"(exports2, module2) {
    var DEFAULT_LOCALE = "en";
    var I18N = {
      en: {
        "command.syncSelectionApply": "Sync LaTeX Color In Selection Or Current Line",
        "command.syncDocumentApply": "Sync LaTeX Color In Current Document",
        "notice.cannotAccessEditorView": "LaTeX Color Sync: Cannot access editor view.",
        "notice.noChanges": "LaTeX Color Sync: No changes. Checked {lineCount} line(s), {formulaCount} formula span(s). Common reasons: no valid math span on target lines, colors already matched, or formulas were skipped by safety rules.",
        "notice.applySummary": "LaTeX Color Sync: Updated {lineCount} line(s), {formulaCount} formula span(s).",
        "notice.undoHint": "Undo with Ctrl/Cmd+Z.",
        "notice.languageChanged": "LaTeX Color Sync: Language updated. Reload plugin to refresh command names.",
        "settings.sectionGeneral": "General",
        "settings.sectionBehavior": "Sync Behavior",
        "settings.language.name": "Language",
        "settings.language.desc": "UI language for settings and notices. Command names refresh after plugin reload.",
        "settings.language.optionAuto": "Auto",
        "settings.language.optionEnglish": "English",
        "settings.language.optionChinese": "Simplified Chinese",
        "settings.autoSyncOnEnter.name": "Auto sync on newline insertion",
        "settings.autoSyncOnEnter.desc": "When document input inserts a new line (\\n), sync nearby LaTeX color automatically.",
        "settings.processPreviousLineOnEnter.name": "Also process previous line on newline insertion",
        "settings.processPreviousLineOnEnter.desc": "Useful when the formula is on the previous line after a new line is inserted.",
        "settings.preferDomColor.name": "Prefer DOM color sampling",
        "settings.preferDomColor.desc": "Use rendered color from editor first. If unavailable, fallback to syntax-role color mapping.",
        "settings.overwriteExistingColor.name": "Overwrite existing top-level LaTeX color",
        "settings.overwriteExistingColor.desc": "If formula already has top-level \\textcolor/\\color wrapper, rewrite it to the target color.",
        "settings.skipEmbeddedColorFormula.name": "Skip formulas containing embedded color commands",
        "settings.skipEmbeddedColorFormula.desc": "Skip formulas that already contain internal \\color or \\textcolor commands.",
        "settings.showNoticeAfterManualSync.name": "Show summary after manual command",
        "settings.showNoticeAfterManualSync.desc": "Show a summary notice after running manual sync commands."
      },
      "zh-CN": {
        "command.syncSelectionApply": "\u540C\u6B65\u9009\u4E2D\u533A\u57DF\u6216\u5F53\u524D\u884C\u5185\u7684 LaTeX \u989C\u8272",
        "command.syncDocumentApply": "\u540C\u6B65\u5F53\u524D\u6587\u6863\u4E2D\u7684 LaTeX \u989C\u8272",
        "notice.cannotAccessEditorView": "LaTeX Color Sync\uFF1A\u65E0\u6CD5\u8BBF\u95EE\u7F16\u8F91\u5668\u89C6\u56FE\u3002",
        "notice.noChanges": "LaTeX Color Sync\uFF1A\u65E0\u53D8\u66F4\u3002\u5DF2\u68C0\u67E5 {lineCount} \u884C\u3001{formulaCount} \u4E2A\u516C\u5F0F\u7247\u6BB5\u3002\u5E38\u89C1\u539F\u56E0\uFF1A\u76EE\u6807\u884C\u6CA1\u6709\u6709\u6548\u516C\u5F0F\u3001\u989C\u8272\u672C\u6765\u5C31\u4E00\u81F4\uFF0C\u6216\u88AB\u5B89\u5168\u89C4\u5219\u8DF3\u8FC7\u3002",
        "notice.applySummary": "LaTeX Color Sync\uFF1A\u5DF2\u66F4\u65B0 {lineCount} \u884C\u3001{formulaCount} \u4E2A\u516C\u5F0F\u7247\u6BB5\u3002",
        "notice.undoHint": "\u53EF\u7528 Ctrl/Cmd+Z \u64A4\u9500\u3002",
        "notice.languageChanged": "LaTeX Color Sync\uFF1A\u8BED\u8A00\u5DF2\u66F4\u65B0\u3002\u547D\u4EE4\u540D\u79F0\u9700\u91CD\u8F7D\u63D2\u4EF6\u540E\u5237\u65B0\u3002",
        "settings.sectionGeneral": "\u901A\u7528",
        "settings.sectionBehavior": "\u540C\u6B65\u884C\u4E3A",
        "settings.language.name": "\u8BED\u8A00",
        "settings.language.desc": "\u8BBE\u7F6E\u9875\u4E0E\u901A\u77E5\u6587\u6848\u8BED\u8A00\u3002\u547D\u4EE4\u540D\u79F0\u9700\u91CD\u8F7D\u63D2\u4EF6\u540E\u751F\u6548\u3002",
        "settings.language.optionAuto": "\u81EA\u52A8",
        "settings.language.optionEnglish": "English",
        "settings.language.optionChinese": "\u7B80\u4F53\u4E2D\u6587",
        "settings.autoSyncOnEnter.name": "\u63D2\u5165\u65B0\u884C\u65F6\u81EA\u52A8\u540C\u6B65",
        "settings.autoSyncOnEnter.desc": "\u53EA\u8981\u6587\u6863\u8F93\u5165\u63D2\u5165\u4E86\u65B0\u884C\uFF08\\n\uFF09\uFF0C\u5C31\u81EA\u52A8\u540C\u6B65\u90BB\u8FD1\u516C\u5F0F\u989C\u8272\u3002",
        "settings.processPreviousLineOnEnter.name": "\u63D2\u5165\u65B0\u884C\u65F6\u540C\u65F6\u5904\u7406\u4E0A\u4E00\u884C",
        "settings.processPreviousLineOnEnter.desc": "\u63D2\u5165\u65B0\u884C\u540E\uFF0C\u989D\u5916\u5904\u7406\u4E0A\u4E00\u884C\uFF1B\u9002\u5408\u516C\u5F0F\u5E38\u5728\u4E0A\u4E00\u884C\u7684\u573A\u666F\u3002",
        "settings.preferDomColor.name": "\u4F18\u5148\u91C7\u6837\u7F16\u8F91\u5668\u5B9E\u9645\u989C\u8272",
        "settings.preferDomColor.desc": "\u4F18\u5148\u4F7F\u7528\u7F16\u8F91\u5668\u4E2D\u5B9E\u9645\u6E32\u67D3\u7684\u989C\u8272\uFF0C\u5931\u8D25\u540E\u518D\u4F7F\u7528\u8BED\u6CD5\u89D2\u8272\u56DE\u9000\u3002",
        "settings.overwriteExistingColor.name": "\u8986\u76D6\u5DF2\u6709\u9876\u5C42 LaTeX \u989C\u8272",
        "settings.overwriteExistingColor.desc": "\u516C\u5F0F\u5DF2\u6709\u9876\u5C42 \\textcolor/\\color \u65F6\uFF0C\u76F4\u63A5\u6539\u5199\u4E3A\u76EE\u6807\u989C\u8272\u3002",
        "settings.skipEmbeddedColorFormula.name": "\u8DF3\u8FC7\u542B\u5185\u5D4C\u989C\u8272\u547D\u4EE4\u7684\u516C\u5F0F",
        "settings.skipEmbeddedColorFormula.desc": "\u516C\u5F0F\u5185\u90E8\u5DF2\u6709 \\color \u6216 \\textcolor \u65F6\u8DF3\u8FC7\uFF0C\u907F\u514D\u610F\u5916\u5D4C\u5957\u3002",
        "settings.showNoticeAfterManualSync.name": "\u624B\u52A8\u547D\u4EE4\u540E\u663E\u793A\u6458\u8981",
        "settings.showNoticeAfterManualSync.desc": "\u6267\u884C\u624B\u52A8\u540C\u6B65\u547D\u4EE4\u540E\u663E\u793A\u53D8\u66F4\u6458\u8981\u3002"
      }
    };
    function resolveLocale2(preferredLocale) {
      const normalizedPreferred = normalizeLocale(preferredLocale);
      if (normalizedPreferred !== "auto") {
        return normalizedPreferred;
      }
      const candidates = [];
      if (typeof document !== "undefined" && document.documentElement && document.documentElement.lang) {
        candidates.push(document.documentElement.lang);
      }
      if (typeof window !== "undefined") {
        if (window.moment && typeof window.moment.locale === "function") {
          candidates.push(window.moment.locale());
        }
        if (window.navigator) {
          if (window.navigator.language) {
            candidates.push(window.navigator.language);
          }
          if (Array.isArray(window.navigator.languages)) {
            for (const locale of window.navigator.languages) {
              candidates.push(locale);
            }
          }
        }
      }
      for (const candidate of candidates) {
        const normalized = normalizeLocale(candidate);
        if (normalized !== "auto") {
          return normalized;
        }
      }
      return DEFAULT_LOCALE;
    }
    function normalizeLocale(locale) {
      if (!locale) {
        return "auto";
      }
      const value = String(locale).trim().toLowerCase();
      if (!value || value === "auto") {
        return "auto";
      }
      if (value.startsWith("zh")) {
        return "zh-CN";
      }
      if (value.startsWith("en")) {
        return "en";
      }
      return DEFAULT_LOCALE;
    }
    function translate2(locale, key, variables) {
      const bundle = I18N[locale] || I18N[DEFAULT_LOCALE];
      const fallbackBundle = I18N[DEFAULT_LOCALE];
      const template = bundle[key] || fallbackBundle[key] || key;
      return interpolate(template, variables);
    }
    function interpolate(template, variables) {
      if (!variables) {
        return template;
      }
      return template.replace(/\{([A-Za-z0-9_]+)\}/g, (match, key) => {
        if (Object.prototype.hasOwnProperty.call(variables, key)) {
          return String(variables[key]);
        }
        return match;
      });
    }
    module2.exports = {
      resolveLocale: resolveLocale2,
      translate: translate2
    };
  }
});

// src/latex-utils.js
var require_latex_utils = __commonJS({
  "src/latex-utils.js"(exports2, module2) {
    function findClosingDelimiter(text, openingIndex, delimiterLength) {
      let i = openingIndex + delimiterLength;
      while (i < text.length) {
        if (text[i] === "$" && !isEscaped(text, i)) {
          if (delimiterLength === 2) {
            if (text[i + 1] === "$" && !isEscaped(text, i + 1)) {
              return { start: i, end: i + 2 };
            }
          } else if (text[i + 1] !== "$") {
            return { start: i, end: i + 1 };
          }
        }
        i += 1;
      }
      return null;
    }
    function parseTopLevelColorWrapper2(content) {
      const leadingMatch = content.match(/^\s*/);
      const trailingMatch = content.match(/\s*$/);
      const leading = leadingMatch ? leadingMatch[0] : "";
      const trailing = trailingMatch ? trailingMatch[0] : "";
      const core = content.slice(leading.length, content.length - trailing.length);
      if (!core) {
        return null;
      }
      const direct = parseDirectColorCommand(core, "\\textcolor") || parseDirectColorCommand(core, "\\color");
      if (direct && direct.end === core.length) {
        return {
          leading,
          trailing,
          color: direct.color,
          inner: direct.inner
        };
      }
      const switchWrapper = parseSwitchColorWrapper(core);
      if (switchWrapper) {
        return {
          leading,
          trailing,
          color: switchWrapper.color,
          inner: switchWrapper.inner
        };
      }
      return null;
    }
    function parseDirectColorCommand(core, command) {
      if (!core.startsWith(command)) {
        return null;
      }
      let idx = command.length;
      idx = skipWhitespace(core, idx);
      const colorGroup = parseBraceGroup(core, idx);
      if (!colorGroup) {
        return null;
      }
      idx = skipWhitespace(core, colorGroup.end);
      const innerGroup = parseBraceGroup(core, idx);
      if (!innerGroup) {
        return null;
      }
      idx = skipWhitespace(core, innerGroup.end);
      return {
        color: colorGroup.content.trim(),
        inner: innerGroup.content,
        end: idx
      };
    }
    function parseSwitchColorWrapper(core) {
      if (!core.startsWith("{")) {
        return null;
      }
      const outer = parseBraceGroup(core, 0);
      if (!outer || outer.end !== core.length) {
        return null;
      }
      let idx = skipWhitespace(outer.content, 0);
      if (!outer.content.startsWith("\\color", idx)) {
        return null;
      }
      idx += "\\color".length;
      idx = skipWhitespace(outer.content, idx);
      const colorGroup = parseBraceGroup(outer.content, idx);
      if (!colorGroup) {
        return null;
      }
      const rest = outer.content.slice(colorGroup.end).trim();
      if (!rest) {
        return null;
      }
      return {
        color: colorGroup.content.trim(),
        inner: rest
      };
    }
    function parseBraceGroup(source, startIndex) {
      if (source[startIndex] !== "{") {
        return null;
      }
      let depth = 0;
      for (let i = startIndex; i < source.length; i += 1) {
        const char = source[i];
        if (char === "\\") {
          i += 1;
          continue;
        }
        if (char === "{") {
          depth += 1;
          continue;
        }
        if (char === "}") {
          depth -= 1;
          if (depth === 0) {
            return {
              content: source.slice(startIndex + 1, i),
              end: i + 1
            };
          }
          if (depth < 0) {
            return null;
          }
        }
      }
      return null;
    }
    function skipWhitespace(text, idx) {
      let i = idx;
      while (i < text.length && isWhitespace2(text[i])) {
        i += 1;
      }
      return i;
    }
    function normalizeColorToHex2(raw, contextElement) {
      if (!raw) {
        return null;
      }
      const trimmed = raw.trim();
      if (!trimmed) {
        return null;
      }
      const hex = normalizeHexLiteral(trimmed);
      if (hex) {
        return hex;
      }
      const rgbHex = rgbStringToHex(trimmed);
      if (rgbHex) {
        return rgbHex;
      }
      const probe = document.createElement("span");
      probe.style.color = "";
      probe.style.color = trimmed;
      if (!probe.style.color) {
        return null;
      }
      const mountTarget = contextElement && contextElement.ownerDocument && contextElement.ownerDocument.body || document.body;
      if (!mountTarget) {
        return null;
      }
      mountTarget.appendChild(probe);
      const computed = getComputedStyle(probe).color;
      probe.remove();
      return rgbStringToHex(computed);
    }
    function normalizeHexLiteral(value) {
      if (/^#[0-9a-fA-F]{3}$/.test(value)) {
        const r = value[1];
        const g = value[2];
        const b = value[3];
        return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
      }
      if (/^#[0-9a-fA-F]{6}$/.test(value)) {
        return value.toUpperCase();
      }
      return null;
    }
    function rgbStringToHex(value) {
      const match = value.match(/^rgba?\(\s*([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)(?:\s*,\s*([0-9.]+))?\s*\)$/i);
      if (!match) {
        return null;
      }
      const alpha = match[4] !== void 0 ? Number(match[4]) : 1;
      if (Number.isFinite(alpha) && alpha <= 0) {
        return null;
      }
      const r = clampColorChannel(Number(match[1]));
      const g = clampColorChannel(Number(match[2]));
      const b = clampColorChannel(Number(match[3]));
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    function clampColorChannel(value) {
      if (!Number.isFinite(value)) {
        return 0;
      }
      return Math.max(0, Math.min(255, Math.round(value)));
    }
    function toHex(value) {
      return value.toString(16).padStart(2, "0").toUpperCase();
    }
    function normalizeLatexColorToken2(value) {
      return (value || "").replace(/\s+/g, "").toLowerCase();
    }
    function isEscaped(text, index) {
      let backslashCount = 0;
      for (let i = index - 1; i >= 0; i -= 1) {
        if (text[i] !== "\\") {
          break;
        }
        backslashCount += 1;
      }
      return backslashCount % 2 === 1;
    }
    function isWhitespace2(char) {
      return /\s/.test(char);
    }
    function nodeToElement2(node) {
      if (!node) {
        return null;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        return node;
      }
      return node.parentElement || null;
    }
    function clamp2(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }
    module2.exports = {
      clamp: clamp2,
      findClosingDelimiter,
      isEscaped,
      isWhitespace: isWhitespace2,
      nodeToElement: nodeToElement2,
      normalizeColorToHex: normalizeColorToHex2,
      normalizeLatexColorToken: normalizeLatexColorToken2,
      parseTopLevelColorWrapper: parseTopLevelColorWrapper2
    };
  }
});

// src/main.js
var { Plugin, PluginSettingTab, Setting, Notice } = require("obsidian");
var { EditorView } = require("@codemirror/view");
var { Annotation, Transaction } = require("@codemirror/state");
var { syntaxTree } = require("@codemirror/language");
var { resolveLocale, translate } = require_i18n();
var {
  clamp,
  isWhitespace,
  nodeToElement,
  normalizeColorToHex,
  normalizeLatexColorToken,
  parseTopLevelColorWrapper
} = require_latex_utils();
var SYNC_ANNOTATION = Annotation.define();
var EXCLUDED_NODE_PATTERN = /(Code|FencedCode|CodeBlock|InlineCode|CodeText|FrontMatter|YAML|Html|HTML)/i;
var MATH_BEGIN_MARK_PATTERN = /formatting-math-begin/i;
var MATH_END_MARK_PATTERN = /formatting-math-end/i;
var EMBEDDED_COLOR_PATTERN = /\\(?:textcolor|color)\s*\{/;
var DEFAULT_SETTINGS = {
  language: "auto",
  autoSyncOnEnter: true,
  processPreviousLineOnEnter: true,
  preferDomColor: true,
  overwriteExistingColor: true,
  skipEmbeddedColorFormula: true,
  showNoticeAfterManualSync: true
};
var ROLE_TO_CSS_VARIABLES = {
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
    const lineSet = /* @__PURE__ */ new Set();
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
    const lineSet = /* @__PURE__ */ new Set();
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
        lineNumbers.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n >= 1 && n <= view.state.doc.lines)
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
    const defaultTextColor = this.resolveDefaultTextColor(view);
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
      if (this.isSameColorToken(color, defaultTextColor)) {
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
    const seen = /* @__PURE__ */ new Set();
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
    const visited = /* @__PURE__ */ new Set();
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
  resolveDefaultTextColor(view) {
    if (!view || !view.dom) {
      return this.resolveCssVariableColor("--text-normal", null);
    }
    const fromCssVariable = this.resolveCssVariableColor("--text-normal", view.dom);
    if (fromCssVariable) {
      return fromCssVariable;
    }
    const fromEditor = this.getComputedElementColor(view.dom);
    if (fromEditor) {
      return fromEditor;
    }
    return this.getComputedElementColor(document.body);
  }
  isSameColorToken(a, b) {
    if (!a || !b) {
      return false;
    }
    return normalizeLatexColorToken(a) === normalizeLatexColorToken(b);
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
var LatexColorSyncSettingTab = class extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: this.plugin.t("settings.sectionGeneral") });
    new Setting(containerEl).setName(this.plugin.t("settings.language.name")).setDesc(this.plugin.t("settings.language.desc")).addDropdown((dropdown) => {
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
    new Setting(containerEl).setName(this.plugin.t("settings.showNoticeAfterManualSync.name")).setDesc(this.plugin.t("settings.showNoticeAfterManualSync.desc")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showNoticeAfterManualSync).onChange(async (value) => {
        this.plugin.settings.showNoticeAfterManualSync = value;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h2", { text: this.plugin.t("settings.sectionBehavior") });
    new Setting(containerEl).setName(this.plugin.t("settings.autoSyncOnEnter.name")).setDesc(this.plugin.t("settings.autoSyncOnEnter.desc")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoSyncOnEnter).onChange(async (value) => {
        this.plugin.settings.autoSyncOnEnter = value;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl).setName(this.plugin.t("settings.processPreviousLineOnEnter.name")).setDesc(this.plugin.t("settings.processPreviousLineOnEnter.desc")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.processPreviousLineOnEnter).onChange(async (value) => {
        this.plugin.settings.processPreviousLineOnEnter = value;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl).setName(this.plugin.t("settings.preferDomColor.name")).setDesc(this.plugin.t("settings.preferDomColor.desc")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.preferDomColor).onChange(async (value) => {
        this.plugin.settings.preferDomColor = value;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl).setName(this.plugin.t("settings.overwriteExistingColor.name")).setDesc(this.plugin.t("settings.overwriteExistingColor.desc")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.overwriteExistingColor).onChange(async (value) => {
        this.plugin.settings.overwriteExistingColor = value;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl).setName(this.plugin.t("settings.skipEmbeddedColorFormula.name")).setDesc(this.plugin.t("settings.skipEmbeddedColorFormula.desc")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.skipEmbeddedColorFormula).onChange(async (value) => {
        this.plugin.settings.skipEmbeddedColorFormula = value;
        await this.plugin.saveSettings();
      })
    );
  }
};
