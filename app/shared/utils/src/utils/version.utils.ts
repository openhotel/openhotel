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

  const isSameMajor = slicedNewVersion.major === slicedOldVersion.major;
  if (isSameMajor && slicedNewVersion.minor > slicedOldVersion.minor)
    return true;

  const isSameMinor = slicedNewVersion.minor === slicedOldVersion.minor;
  if (
    isSameMajor &&
    isSameMinor &&
    slicedNewVersion.patch > slicedOldVersion.patch
  )
    return true;

  const isSamePatch = slicedNewVersion.patch === slicedOldVersion.patch;

  const oldAdditionIndex = getVersionAdditionIndex(slicedOldVersion.additional);
  const newAdditionIndex = getVersionAdditionIndex(slicedNewVersion.additional);

  if (
    isSameMajor &&
    isSameMinor &&
    isSamePatch &&
    newAdditionIndex > oldAdditionIndex
  )
    return true;

  const isSameAdditional = newAdditionIndex === oldAdditionIndex;
  return (
    isSameMajor &&
    isSameMinor &&
    isSamePatch &&
    isSameAdditional &&
    (slicedNewVersion.additionalPatch ?? 0) >
      (slicedOldVersion.additionalPatch ?? 0)
  );
};
