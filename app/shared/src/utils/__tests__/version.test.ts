import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { isNewVersionGreater } from "@shared/utils/versions.utils.ts";

describe("utils", () => {
  describe("versions", () => {
    describe("isNewVersionGreater", () => {
      for (const version of ["1.15.3", "v1.15.3"]) {
        it(`equal ${version} is not greater than itself`, () => {
          expect(isNewVersionGreater(version, version)).toBe(false);
        });
      }

      const greater = [
        { oldVersion: "0.0.0", newVersion: "1.0.0" },
        { oldVersion: "0.1.0", newVersion: "1.0.0" },
        { oldVersion: "0.0.1", newVersion: "1.0.0" },
        { oldVersion: "0.0.0", newVersion: "0.1.0" },
        { oldVersion: "0.0.1", newVersion: "0.1.0" },
        { oldVersion: "0.0.0", newVersion: "0.0.1" },
        { oldVersion: "v0.9.2", newVersion: "v1.0.0" },
      ];
      for (const { oldVersion, newVersion } of greater) {
        it(`new ${newVersion} is greater than old ${oldVersion}`, () => {
          expect(isNewVersionGreater(oldVersion, newVersion)).toBe(true);
        });
        it(`new ${oldVersion} is not greater than old ${newVersion}`, () => {
          expect(isNewVersionGreater(newVersion, oldVersion)).toBe(false);
        });
      }

      it("throws on invalid version", () => {
        expect(() => isNewVersionGreater("0.0.1-rc.1", "0.0.1")).toThrow();
      });
    });
  });
});
