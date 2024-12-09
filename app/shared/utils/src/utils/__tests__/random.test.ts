import { describe, it, expect } from "@jest/globals";
import { getRandomString } from "../random.utils.ts";

describe("utils", () => {
  describe("random", () => {
    describe("getRandomString", () => {
      it("should return a valid random string", () => {
        const randomString = getRandomString(100);
        // /^[a-zA-Z0-9]+$/ ->
        // a-z: lowercase letters
        // A-Z: uppercase letters
        // 0-9: digits
        // +: one or more occurrences
        expect(randomString).toMatch(/^[a-zA-Z0-9]+$/);
        expect(randomString.length).toBe(100);
      });
    });
  });
});
