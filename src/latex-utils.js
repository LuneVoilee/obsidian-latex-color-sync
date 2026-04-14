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

function parseTopLevelColorWrapper(content) {
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
	while (i < text.length && isWhitespace(text[i])) {
		i += 1;
	}
	return i;
}

function normalizeColorToHex(raw, contextElement) {
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
	const mountTarget = (contextElement && contextElement.ownerDocument && contextElement.ownerDocument.body) || document.body;
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
	const alpha = match[4] !== undefined ? Number(match[4]) : 1;
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

function normalizeLatexColorToken(value) {
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

function isWhitespace(char) {
	return /\s/.test(char);
}

function nodeToElement(node) {
	if (!node) {
		return null;
	}
	if (node.nodeType === Node.ELEMENT_NODE) {
		return node;
	}
	return node.parentElement || null;
}

function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

module.exports = {
	clamp,
	findClosingDelimiter,
	isEscaped,
	isWhitespace,
	nodeToElement,
	normalizeColorToHex,
	normalizeLatexColorToken,
	parseTopLevelColorWrapper
};
