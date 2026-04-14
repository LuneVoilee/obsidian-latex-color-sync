const DEFAULT_LOCALE = "en";

const I18N = {
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
		"command.syncSelectionApply": "同步选中区域或当前行内的 LaTeX 颜色",
		"command.syncDocumentApply": "同步当前文档中的 LaTeX 颜色",
		"notice.cannotAccessEditorView": "LaTeX Color Sync：无法访问编辑器视图。",
		"notice.noChanges": "LaTeX Color Sync：无变更。已检查 {lineCount} 行、{formulaCount} 个公式片段。常见原因：目标行没有有效公式、颜色本来就一致，或被安全规则跳过。",
		"notice.applySummary": "LaTeX Color Sync：已更新 {lineCount} 行、{formulaCount} 个公式片段。",
		"notice.undoHint": "可用 Ctrl/Cmd+Z 撤销。",
		"notice.languageChanged": "LaTeX Color Sync：语言已更新。命令名称需重载插件后刷新。",
		"settings.sectionGeneral": "通用",
		"settings.sectionBehavior": "同步行为",
		"settings.language.name": "语言",
		"settings.language.desc": "设置页与通知文案语言。命令名称需重载插件后生效。",
		"settings.language.optionAuto": "自动",
		"settings.language.optionEnglish": "English",
		"settings.language.optionChinese": "简体中文",
		"settings.autoSyncOnEnter.name": "插入新行时自动同步",
		"settings.autoSyncOnEnter.desc": "只要文档输入插入了新行（\\n），就自动同步邻近公式颜色。",
		"settings.processPreviousLineOnEnter.name": "插入新行时同时处理上一行",
		"settings.processPreviousLineOnEnter.desc": "插入新行后，额外处理上一行；适合公式常在上一行的场景。",
		"settings.preferDomColor.name": "优先采样编辑器实际颜色",
		"settings.preferDomColor.desc": "优先使用编辑器中实际渲染的颜色，失败后再使用语法角色回退。",
		"settings.overwriteExistingColor.name": "覆盖已有顶层 LaTeX 颜色",
		"settings.overwriteExistingColor.desc": "公式已有顶层 \\textcolor/\\color 时，直接改写为目标颜色。",
		"settings.skipEmbeddedColorFormula.name": "跳过含内嵌颜色命令的公式",
		"settings.skipEmbeddedColorFormula.desc": "公式内部已有 \\color 或 \\textcolor 时跳过，避免意外嵌套。",
		"settings.showNoticeAfterManualSync.name": "手动命令后显示摘要",
		"settings.showNoticeAfterManualSync.desc": "执行手动同步命令后显示变更摘要。"
	}
};

function resolveLocale(preferredLocale) {
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

function translate(locale, key, variables) {
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

module.exports = {
	resolveLocale,
	translate
};
