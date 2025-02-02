import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { USER_2 } from "../consts.ts";

import { STATE } from "../state.ts";

describe("7. register new account", () => {
  describe("valid register", () => {
    it("register", async () => {
      const { status, data, message } = await fetcher("/account/register", {
        method: "POST",
        body: JSON.stringify({
          email: USER_2.email,
          username: USER_2.username,
          password: USER_2.password,
          rePassword: USER_2.password,
          languages: USER_2.languages,
        }),
      });
      assertEquals(status, 200);
      assertEquals(data, undefined);
      assertEquals(message, undefined);
    });

    it("checks that user is counted on public count", async () => {
      const { status, data } = await fetcher("/user/count");
      assertEquals(status, 200);
      assertEquals(data, { count: 2 });
    });

    it("login", async () => {
      const { status, data } = await fetcher("/account/login", {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_2.email),
        body: JSON.stringify({
          email: USER_2.email,
          password: USER_2.password,
        }),
      });
      assertEquals(status, 200);
      assertExists(data.accountId);
      assertExists(data.durations);
      assertExists(data.refreshToken);
      assertExists(data.token);

      STATE.setUser(USER_2.email, data);
    });
    it("check if session token work", async () => {
      const { status, data } = await fetcher("/user/@me", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_2.email),
      });
      assertEquals(status, 200);
      assertEquals(data, {
        accountId: STATE.getUser(USER_2.email).accountId,
        languages: USER_2.languages,
        username: USER_2.username,
      });
    });
  });
});
