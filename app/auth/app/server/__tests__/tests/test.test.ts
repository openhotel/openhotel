import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";

describe("public calls", () => {
  it("retrieves the version", async () => {
    const { status, data } = await fetcher("/version");
    assertEquals(status, 200);
    assertEquals(data, { version: "development" });
  });

  it("retrieves the user count", async () => {
    const { status, data } = await fetcher("/user/count");
    assertEquals(status, 200);
    assertEquals(data, { count: 0 });
  });
});
