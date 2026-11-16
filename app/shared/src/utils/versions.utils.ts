import { VERSION_SEMANTIC_REGEX } from "@shared/consts/versions.consts.ts";
import { Version } from "@shared/types/versions.types.ts";

export const getSlicedVersion = (version: string): Version => {
  const match = version.trim().match(VERSION_SEMANTIC_REGEX);
  if (!match) throw new Error(`Invalid version: "${version}"`);

  const [, major, minor, patch] = match;

  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
  };
};

export const compareVersions = (a: string, b: string): number => {
  const va = getSlicedVersion(a);
  const vb = getSlicedVersion(b);

  return va.major - vb.major || va.minor - vb.minor || va.patch - vb.patch;
};

export const isNewVersionGreater = (
  oldVersion: string,
  newVersion: string,
): boolean => compareVersions(newVersion, oldVersion) > 0;
