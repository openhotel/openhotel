import { AdditionalVersion, Version } from "../types/version.types.ts";

export const getVersionAdditionIndex = (
  additional?: AdditionalVersion,
): number => {
  if (additional === "rc") return 4;
  if (additional === "beta") return 3;
  if (additional === "alpha") return 1;
  return 5;
};

export const getSlicedVersion = (version: string): Version => {
  if (version.startsWith("v")) version = version.slice(1);

  const VER_SEM_REGEX =
    /([0-9]{1,}).([0-9]{1,}).([0-9]{1,})(?:-(alpha|beta|rc).([0-9]{1,}))?/;

  const [, major, minor, patch, additional, additionalPatch] = version.match(
    new RegExp(VER_SEM_REGEX),
  )!;

  return {
    major: parseInt(major),
    minor: parseInt(minor),
    patch: parseInt(patch),
    additional: additional as AdditionalVersion,
    additionalPatch: additionalPatch ? parseInt(additionalPatch) : undefined,
  };
};

export const isNewVersionGreater = (
  oldVersion: string,
  newVersion: string,
): boolean => {
  const slicedOldVersion = getSlicedVersion(oldVersion);
  const slicedNewVersion = getSlicedVersion(newVersion);

  if (slicedNewVersion.major > slicedOldVersion.major) return true;
  if (slicedNewVersion.major < slicedOldVersion.major) return false;

  if (slicedNewVersion.minor > slicedOldVersion.minor) return true;
  if (slicedNewVersion.minor < slicedOldVersion.minor) return false;

  if (slicedNewVersion.patch > slicedOldVersion.patch) return true;
  if (slicedNewVersion.patch < slicedOldVersion.patch) return false;

  const oldAdditionIndex = getVersionAdditionIndex(slicedOldVersion.additional);
  const newAdditionIndex = getVersionAdditionIndex(slicedNewVersion.additional);

  if (newAdditionIndex > oldAdditionIndex) return true;
  if (newAdditionIndex < oldAdditionIndex) return false;

  return (
    (slicedNewVersion.additionalPatch ?? 0) >
    (slicedOldVersion.additionalPatch ?? 0)
  );
};
