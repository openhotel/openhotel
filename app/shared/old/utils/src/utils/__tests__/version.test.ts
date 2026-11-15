import { expect, test } from "@jest/globals";
import { isNewVersionGreater } from "../version.utils.ts";

test.each(["v1.15.3-rc.27"])(
  "equal new version is not greater than old",
  (sameVersion) => {
    expect(isNewVersionGreater(sameVersion, sameVersion)).toBeFalsy();
  },
);

const newVersionIsGreater = [
  { lowerOldVersion: "0.0.0", greaterNewVersion: "1.0.0" },
  { lowerOldVersion: "0.1.0", greaterNewVersion: "1.0.0" },
  { lowerOldVersion: "0.0.1", greaterNewVersion: "1.0.0" },
  { lowerOldVersion: "0.0.0", greaterNewVersion: "0.1.0" },
  { lowerOldVersion: "0.0.1", greaterNewVersion: "0.1.0" },
  { lowerOldVersion: "0.0.0", greaterNewVersion: "0.0.1" },
  { lowerOldVersion: "0.0.1-rc.1", greaterNewVersion: "0.0.1" },
  { lowerOldVersion: "0.0.1-rc.1", greaterNewVersion: "0.0.1-rc.2" },
  { lowerOldVersion: "0.0.1-beta.2", greaterNewVersion: "0.0.1-rc.1" },
  { lowerOldVersion: "0.0.1-alpha.2", greaterNewVersion: "0.0.1-beta.1" },
];

test.each(newVersionIsGreater)(
  "new $greaterNewVersion is greater than old $lowerOldVersion",
  ({ lowerOldVersion, greaterNewVersion }) => {
    expect(
      isNewVersionGreater(lowerOldVersion, greaterNewVersion),
    ).toBeTruthy();
  },
);

const newVersionIsLower = [
  { greaterOldVersion: "1.0.0", lowerNewVersion: "0.0.0" },
  { greaterOldVersion: "1.0.0", lowerNewVersion: "0.1.0" },
  { greaterOldVersion: "1.0.0", lowerNewVersion: "0.0.1" },
  { greaterOldVersion: "0.1.0", lowerNewVersion: "0.0.0" },
  { greaterOldVersion: "0.1.0", lowerNewVersion: "0.0.1" },
  { greaterOldVersion: "0.0.1", lowerNewVersion: "0.0.0" },
  { greaterOldVersion: "0.0.1", lowerNewVersion: "0.0.1-rc.1" },
  { greaterOldVersion: "0.0.1-rc.2", lowerNewVersion: "0.0.1-rc.1" },
  { greaterOldVersion: "0.0.1-rc.1", lowerNewVersion: "0.0.1-beta.2" },
  { greaterOldVersion: "0.0.1-beta.1", lowerNewVersion: "0.0.1-alpha.2" },
];
test.each(newVersionIsLower)(
  "new $lowerNewVersion is not greater than old $greaterOldVersion",
  ({ greaterOldVersion, lowerNewVersion }) => {
    expect(isNewVersionGreater(greaterOldVersion, lowerNewVersion)).toBeFalsy();
  },
);
