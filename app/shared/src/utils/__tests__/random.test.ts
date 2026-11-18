import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { getRandomString } from "@shared/utils/random.utils.ts";

describe("utils", () => {
  describe("random", () => {
    describe("getRandomString", () => {
      it("should return a valid random string", () => {
        const randomString = getRandomString(100);
        expect(randomString).toMatch(/^[a-zA-Z0-9]+$/);
        expect(randomString.length).toBe(100);
      });
    });
  });
});
