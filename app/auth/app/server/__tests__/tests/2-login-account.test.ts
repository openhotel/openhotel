import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import {
  INVALID_EMAILS,
  INVALID_PASSWORD,
  USER_1,
  USER_AGENTS,
} from "../consts.ts";

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
      assertEquals(status, 400);
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
      assertEquals(status, 400);
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
  describe("check tokens", () => {
    it("check current sessions to be one", async () => {
      const { status, data } = await fetcher("/account/token", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(status, 200);
      assertEquals(data.tokens.length, 1);

      const [{ browser, ip, os, tokenId, updatedAt }] = data.tokens;

      assertEquals(browser, "Firefox");
      assertEquals(ip, "23.23.23.23");
      assertEquals(os, "Linux");
      assertExists(tokenId);
      assertExists(updatedAt);
    });

    it("login again to the same user with different user agent and ip", async () => {
      const { status, data } = await fetcher("/account/login", {
        method: "POST",
        headers: {
          "user-agent": USER_AGENTS.CHROME,
          "x-forwarded-for": "1.2.3.4",
        },
        body: JSON.stringify({
          email: USER_1.email,
          password: USER_1.password,
        }),
      });
      assertEquals(status, 200);
      STATE.setUser(USER_1.email + "2", data);
    });
    it("check if new session work", async () => {
      const { status, data } = await fetcher("/user/@me", {
        method: "GET",
        headers: {
          ...STATE.getSessionHeaders(USER_1.email + "2"),
          "user-agent": USER_AGENTS.CHROME,
          "x-forwarded-for": "1.2.3.4",
        },
      });
      assertEquals(status, 200);
      assertEquals(data, {
        accountId: STATE.getUser(USER_1.email + "2").accountId,
        languages: USER_1.languages,
        username: USER_1.username,
      });
    });
    it("check if first session still work", async () => {
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
    it("check current sessions to be two", async () => {
      const { status, data } = await fetcher("/account/token", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(status, 200);
      assertEquals(data.tokens.length, 2);

      assertExists(
        data.tokens.find(
          (token: any) =>
            token.browser === "Firefox" && token.ip === "23.23.23.23",
        ),
      );
      assertExists(
        data.tokens.find(
          (token: any) => token.browser === "Chrome" && token.ip === "1.2.3.4",
        ),
      );
    });
    it("remove session token", async () => {
      const { status } = await fetcher(
        `/account/token?tokenId=${STATE.getUser(USER_1.email + "2").token.substring(0, 4)}`,
        {
          method: "DELETE",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 200);
    });
    it("check current sessions to be one", async () => {
      const { status, data } = await fetcher("/account/token", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(status, 200);
      assertEquals(data.tokens.length, 1);

      const [{ browser, ip, os, tokenId, updatedAt }] = data.tokens;

      assertEquals(browser, "Firefox");
      assertEquals(ip, "23.23.23.23");
      assertEquals(os, "Linux");
      assertExists(tokenId);
      assertExists(updatedAt);
    });
    it("check if new session doesn't work anymore", async () => {
      const { status } = await fetcher("/user/@me", {
        method: "GET",
        headers: {
          ...STATE.getSessionHeaders(USER_1.email + "2"),
          "user-agent": USER_AGENTS.CHROME,
          "x-forwarded-for": "1.2.3.4",
        },
      });
      assertEquals(status, 403);
    });
  });
});
