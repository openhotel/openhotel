import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { INVALID_EMAILS, INVALID_PASSWORD, USER_1 } from "../consts.ts";

import { STATE } from "../state.ts";

describe("3. login an account", () => {
  describe("invalid login", () => {
    it("check invalid email", async () => {
      const { status, data, message } = await fetcher("/account/login", {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          email: INVALID_EMAILS[2],
          password: USER_1.password,
        }),
      });
      assertEquals(status, 403);
      assertEquals(data, undefined);
      assertEquals(message, "Email or password not valid!");
    });
    it("check invalid password", async () => {
      const { status, data, message } = await fetcher("/account/login", {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          email: USER_1.email,
          password: INVALID_PASSWORD,
        }),
      });
      assertEquals(status, 403);
      assertEquals(data, undefined);
      assertEquals(message, "Email or password not valid!");
    });
  });
  describe("valid login", () => {
    it("login", async () => {
      const { status, data } = await fetcher("/account/login", {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          email: USER_1.email,
          password: USER_1.password,
        }),
      });
      assertEquals(status, 200);
      assertExists(data.accountId);
      assertExists(data.durations);
      assertExists(data.refreshToken);
      assertExists(data.token);

      STATE.setUser(USER_1.email, data);
    });
    it("check if session token work", async () => {
      const { status, data } = await fetcher("/user/@me", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(status, 200);
      assertEquals(data, {
        accountId: STATE.getUser(USER_1.email).accountId,
        languages: USER_1.languages,
        username: USER_1.username,
      });
    });
  });
});
