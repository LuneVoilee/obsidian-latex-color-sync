#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)$/;

function fail(message) {
	console.error(`[version-bump] ${message}`);
	process.exit(1);
}

function info(message) {
	console.log(`[version-bump] ${message}`);
}

function parseSemver(value) {
	const match = String(value).trim().match(SEMVER_RE);
	if (!match) {
		return null;
	}
	return {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3])
	};
}

function compareSemver(a, b) {
	const pa = parseSemver(a);
	const pb = parseSemver(b);
	if (!pa || !pb) {
		return String(a).localeCompare(String(b));
	}
	if (pa.major !== pb.major) return pa.major - pb.major;
	if (pa.minor !== pb.minor) return pa.minor - pb.minor;
	return pa.patch - pb.patch;
}

function bumpVersion(version, bumpType) {
	const parsed = parseSemver(version);
	if (!parsed) {
		fail(`Invalid current version '${version}'. Expected x.y.z.`);
	}
	switch (bumpType) {
		case "major":
			return `${parsed.major + 1}.0.0`;
		case "minor":
			return `${parsed.major}.${parsed.minor + 1}.0`;
		case "patch":
			return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
		default:
			fail(`Unknown bump type '${bumpType}'. Use major/minor/patch.`);
	}
}

function readText(filePath) {
	return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, content, dryRun) {
	if (dryRun) return;
	fs.writeFileSync(filePath, content, "utf8");
}

function readJson(filePath) {
	return JSON.parse(readText(filePath));
}

function writeJson(filePath, value, dryRun) {
	const output = `${JSON.stringify(value, null, 2)}\n`;
	writeText(filePath, output, dryRun);
}

function runGit(args, cwd, inherit = false) {
	const result = spawnSync("git", args, {
		cwd,
		encoding: "utf8",
		stdio: inherit ? "inherit" : "pipe"
	});
	if (result.error) {
		fail(`Failed to run git ${args.join(" ")}: ${result.error.message}`);
	}
	if (result.status !== 0) {
		const stderr = (result.stderr || "").trim();
		fail(`git ${args.join(" ")} failed${stderr ? `: ${stderr}` : "."}`);
	}
	return String(result.stdout || "").trim();
}

function formatToday() {
	const now = new Date();
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, "0");
	const d = String(now.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

function updateReadmeReleaseExamples(content, nextVersion) {
	let out = content;
	out = out.replace(
		/(Trigger: push a tag like `)v\d+\.\d+\.\d+(` \(or `)\d+\.\d+\.\d+(`\))/,
		`$1v${nextVersion}$2${nextVersion}$3`
	);
	out = out.replace(
		/(触发方式：推送 Tag（如 `)v\d+\.\d+\.\d+(` 或 `)\d+\.\d+\.\d+(`）)/,
		`$1v${nextVersion}$2${nextVersion}$3`
	);
	return out;
}

function insertChangelogSection(content, nextVersion) {
	const heading = `## [${nextVersion}]`;
	if (content.includes(heading)) {
		return content;
	}

	const section = `${heading} - ${formatToday()}

### Changed

- [TODO]

`;
	const marker = "All notable changes to this project are documented in this file.\n\n";
	if (content.includes(marker)) {
		return content.replace(marker, `${marker}${section}`);
	}
	return `${section}${content}`;
}

function printUsage() {
	console.log(`Usage:
  node scripts/bump-version.mjs --set <x.y.z> [options]
  node scripts/bump-version.mjs --bump <major|minor|patch> [options]
  node scripts/bump-version.mjs <major|minor|patch> [options]

Options:
  --set <x.y.z>          Set exact next version
  --bump <type>          Bump major/minor/patch
  --min-app <x.y.z>      Override manifest minAppVersion for the new version
  --tag                  Create git tag after version sync
  --push-tag             Push created tag to origin (implies --tag)
  --tag-name <name>      Use explicit tag name (default: <tag-prefix><version>)
  --tag-prefix <prefix>  Prefix used when composing tag name (default: v)
  --readme               Update README release tag examples (default: on)
  --no-readme            Skip README example updates
  --changelog            Insert new CHANGELOG section if missing (default: off)
  --dry-run              Show changes without writing files
  -h, --help             Show help
`);
}

function parseArgs(argv) {
	const args = {
		setVersion: null,
		bumpType: null,
		minAppVersion: null,
		createTag: false,
		pushTag: false,
		tagName: null,
		tagPrefix: "v",
		updateReadme: true,
		updateChangelog: false,
		dryRun: false
	};

	for (let i = 0; i < argv.length; i += 1) {
		const token = argv[i];
		if (token === "-h" || token === "--help") {
			printUsage();
			process.exit(0);
		}
		if (token === "--set") {
			args.setVersion = argv[i + 1];
			i += 1;
			continue;
		}
		if (token === "--bump") {
			args.bumpType = argv[i + 1];
			i += 1;
			continue;
		}
		if (token === "--min-app") {
			args.minAppVersion = argv[i + 1];
			i += 1;
			continue;
		}
		if (token === "--tag") {
			args.createTag = true;
			continue;
		}
		if (token === "--push-tag") {
			args.pushTag = true;
			args.createTag = true;
			continue;
		}
		if (token === "--tag-name") {
			args.tagName = argv[i + 1];
			i += 1;
			continue;
		}
		if (token === "--tag-prefix") {
			args.tagPrefix = argv[i + 1] ?? "";
			i += 1;
			continue;
		}
		if (token === "--readme") {
			args.updateReadme = true;
			continue;
		}
		if (token === "--no-readme") {
			args.updateReadme = false;
			continue;
		}
		if (token === "--changelog") {
			args.updateChangelog = true;
			continue;
		}
		if (token === "--dry-run") {
			args.dryRun = true;
			continue;
		}
		if (token === "major" || token === "minor" || token === "patch") {
			args.bumpType = token;
			continue;
		}
		fail(`Unknown argument '${token}'. Use --help for usage.`);
	}

	return args;
}

function ensureSemver(value, flagName) {
	if (!value) {
		fail(`Missing value for ${flagName}.`);
	}
	if (!parseSemver(value)) {
		fail(`Invalid ${flagName} '${value}'. Expected x.y.z.`);
	}
	return value;
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const cwd = process.cwd();

	const filePaths = {
		packageJson: path.join(cwd, "package.json"),
		manifestJson: path.join(cwd, "manifest.json"),
		versionsJson: path.join(cwd, "versions.json"),
		packageLockJson: path.join(cwd, "package-lock.json"),
		readmeEn: path.join(cwd, "README.md"),
		readmeZh: path.join(cwd, "README_CN.md"),
		changelog: path.join(cwd, "CHANGELOG.md")
	};

	for (const [key, p] of Object.entries(filePaths)) {
		if (key === "packageLockJson" && !fs.existsSync(p)) {
			continue;
		}
		if (!fs.existsSync(p)) {
			fail(`Required file not found: ${p}`);
		}
	}

	const packageJson = readJson(filePaths.packageJson);
	const manifestJson = readJson(filePaths.manifestJson);
	const versionsJson = readJson(filePaths.versionsJson);
	const packageLock = fs.existsSync(filePaths.packageLockJson) ? readJson(filePaths.packageLockJson) : null;

	const currentVersion = packageJson.version;
	if (!parseSemver(currentVersion)) {
		fail(`package.json version '${currentVersion}' is not valid semver.`);
	}

	if (args.setVersion && args.bumpType) {
		fail("Use either --set or --bump, not both.");
	}
	if (args.tagName && args.tagPrefix !== "v") {
		fail("Use either --tag-name or --tag-prefix, not both.");
	}

	let nextVersion = args.setVersion;
	if (nextVersion) {
		nextVersion = ensureSemver(nextVersion, "--set");
	} else {
		const bumpType = args.bumpType || "patch";
		if (!["major", "minor", "patch"].includes(bumpType)) {
			fail(`Invalid bump type '${bumpType}'. Use major/minor/patch.`);
		}
		nextVersion = bumpVersion(currentVersion, bumpType);
	}

	const minAppVersion = args.minAppVersion
		? ensureSemver(args.minAppVersion, "--min-app")
		: manifestJson.minAppVersion;

	packageJson.version = nextVersion;
	manifestJson.version = nextVersion;
	manifestJson.minAppVersion = minAppVersion;

	if (packageLock) {
		packageLock.version = nextVersion;
		if (packageLock.packages && packageLock.packages[""]) {
			packageLock.packages[""].version = nextVersion;
		}
	}

	const mergedVersions = { ...versionsJson, [nextVersion]: minAppVersion };
	const sortedVersions = {};
	for (const key of Object.keys(mergedVersions).sort(compareSemver)) {
		sortedVersions[key] = mergedVersions[key];
	}

	let readmeEn = readText(filePaths.readmeEn);
	let readmeZh = readText(filePaths.readmeZh);
	if (args.updateReadme) {
		readmeEn = updateReadmeReleaseExamples(readmeEn, nextVersion);
		readmeZh = updateReadmeReleaseExamples(readmeZh, nextVersion);
	}

	let changelog = readText(filePaths.changelog);
	if (args.updateChangelog) {
		changelog = insertChangelogSection(changelog, nextVersion);
	}

	writeJson(filePaths.packageJson, packageJson, args.dryRun);
	writeJson(filePaths.manifestJson, manifestJson, args.dryRun);
	writeJson(filePaths.versionsJson, sortedVersions, args.dryRun);
	if (packageLock) {
		writeJson(filePaths.packageLockJson, packageLock, args.dryRun);
	}
	writeText(filePaths.readmeEn, readmeEn, args.dryRun);
	writeText(filePaths.readmeZh, readmeZh, args.dryRun);
	writeText(filePaths.changelog, changelog, args.dryRun);

	let resolvedTagName = null;
	if (args.createTag) {
		runGit(["rev-parse", "--is-inside-work-tree"], cwd);
		resolvedTagName = args.tagName ?? `${args.tagPrefix}${nextVersion}`;
		if (!resolvedTagName || !String(resolvedTagName).trim()) {
			fail("Resolved tag name is empty.");
		}

		const existingTag = runGit(["tag", "--list", resolvedTagName], cwd);
		if (existingTag) {
			fail(`Tag '${resolvedTagName}' already exists.`);
		}

		if (args.dryRun) {
			info(`Would create tag: ${resolvedTagName}`);
			if (args.pushTag) {
				info(`Would push tag to origin: ${resolvedTagName}`);
			}
		} else {
			runGit(["tag", resolvedTagName], cwd);
			if (args.pushTag) {
				runGit(["push", "origin", resolvedTagName], cwd, true);
			}
		}
	}

	info(`Current version: ${currentVersion}`);
	info(`Next version:    ${nextVersion}`);
	info(`minAppVersion:   ${minAppVersion}`);
	info(`README update:   ${args.updateReadme ? "on" : "off"}`);
	info(`CHANGELOG add:   ${args.updateChangelog ? "on" : "off"}`);
	info(`Tag action:      ${args.createTag ? resolvedTagName : "off"}`);
	info(`Push tag:        ${args.pushTag ? "on" : "off"}`);
	info(args.dryRun ? "Dry run complete (no files written)." : "Version sync complete.");
}

main();
