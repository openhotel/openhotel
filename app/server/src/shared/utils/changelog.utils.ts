import { VersionContent } from "../types/changelog.types.ts";

export const parseChangelog = (changelog: string): VersionContent[] => {
  const versionBlocks: VersionContent[] = [];
  const versionRegex =
    /<a name="([^"]+)"><\/a>\n+## \[([^\]]+)\]\([^)]+\) \(([^)]+)\)\n+([\s\S]*?)(?=\n<a name="|$)/g;

  let versionMatch: RegExpExecArray;
  while ((versionMatch = versionRegex.exec(changelog)) !== null) {
    const [_, _anchor, version, date, body] = versionMatch;

    const sections = parseSections(body);
    versionBlocks.push({ version, date, sections });
  }

  return versionBlocks;
};

const parseSections = (body: string): { [section: string]: string[] } => {
  const sections: { [section: string]: string[] } = {};
  const sectionRegex = /### (.*?)\n\n([\s\S]*?)(?=\n### |$)/g;

  let sectionMatch: RegExpExecArray;
  while ((sectionMatch = sectionRegex.exec(body)) !== null) {
    const [_, title, content] = sectionMatch;

    sections[title] = content
      .split("\n")
      .filter((line) => line.startsWith("- "))
      .map((line) => line.trim().substring(2));
  }

  return sections;
};

export const getChangesBetweenVersions = (
  changelog: VersionContent[],
  fromVersion: string,
  toVersion: string,
) => {
  const from = changelog.find((v) => v.version === fromVersion);
  const to = changelog.find((v) => v.version === toVersion);

  if (!from || !to) {
    return [];
  }

  const startIndex = changelog.findIndex((v) => v.version === toVersion);
  const endIndex = changelog.findIndex((v) => v.version === fromVersion);

  return changelog.slice(startIndex, endIndex);
};
