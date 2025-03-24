import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { LANGUAGE_LIST } from "../../src/shared/consts/language.consts.ts";

describe("1. public calls", () => {
  it("retrieves the version", async () => {
    const { status, data } = await fetcher("/_/version");
    assertEquals(status, 200);
    assertEquals(data, { version: "development" });
  });

  it("retrieves the user count", async () => {
    const { status, data } = await fetcher("/user/count");
    assertEquals(status, 200);
    assertEquals(data, { count: 0 });
  });

  it("retrieves the hotels list", async () => {
    const { status, data } = await fetcher("/hotel/list");
    assertEquals(status, 200);
    assertEquals(data, { hotels: [] });
  });

  it("retrieves the languages", async () => {
    const { status, data } = await fetcher("/data/languages");
    assertEquals(status, 200);
    assertEquals(data, { languages: LANGUAGE_LIST });
  });
});
