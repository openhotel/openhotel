import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import {
  INVALID_EMAILS,
  INVALID_LANGUAGE,
  INVALID_PASSWORD,
  INVALID_USERNAMES,
  USER_1,
} from "../consts.ts";

describe("1. register an account", () => {
  describe("invalid register", () => {
    it("try to register with no body", async () => {
      const { status } = await fetcher("/account/register", {
        method: "POST",
      });
      assertEquals(status, 500);
    });
    it("try to register with empty body", async () => {
      const { status, data, message } = await fetcher("/account/register", {
        method: "POST",
        body: JSON.stringify({}),
      });
      assertEquals(status, 400);
      assertEquals(data, undefined);
      assertEquals(message, "Some input is missing or invalid captcha!");
    });
    it("try to register with invalid email", async () => {
      for (const email of INVALID_EMAILS) {
        const { status, data, message } = await fetcher("/account/register", {
          method: "POST",
          body: JSON.stringify({
            email,
            username: USER_1.username,
            password: USER_1.password,
            rePassword: USER_1.password,
            languages: USER_1.languages,
          }),
        });
        assertEquals(status, 400);
        assertEquals(data, undefined);
        assertEquals(message, "Invalid email, username or password!");
      }
    });
    it("try to register with invalid password", async () => {
      const { status, data, message } = await fetcher("/account/register", {
        method: "POST",
        body: JSON.stringify({
          email: USER_1.email,
          username: USER_1.username,
          password: INVALID_PASSWORD,
          rePassword: INVALID_PASSWORD,
          languages: USER_1.languages,
        }),
      });
      assertEquals(status, 400);
      assertEquals(data, undefined);
      assertEquals(message, "Invalid email, username or password!");
    });
    it("try to register with too lengthy password", async () => {
      const { status, data, message } = await fetcher("/account/register", {
        method: "POST",
        body: JSON.stringify({
          email: USER_1.email,
          username: USER_1.username,
          password: "ajskhdhkjsadjhkasjkldjklasdjkaskldjkalsdjklajldksa",
          rePassword: INVALID_PASSWORD,
          languages: USER_1.languages,
        }),
      });
      assertEquals(status, 400);
      assertEquals(data, undefined);
      assertEquals(
        message,
        "Password length cannot be more than 45 characters!",
      );
    });
    it("try to register with non matching passwords", async () => {
      const { status, data, message } = await fetcher("/account/register", {
        method: "POST",
        body: JSON.stringify({
          email: USER_1.email,
          username: USER_1.username,
          password: INVALID_PASSWORD,
          rePassword: USER_1.password,
          languages: USER_1.languages,
        }),
      });
      assertEquals(status, 400);
      assertEquals(data, undefined);
      assertEquals(message, "Invalid email, username or password!");
    });
    it("try to register with non valid usernames", async () => {
      for (const username of INVALID_USERNAMES) {
        const { status, data, message } = await fetcher("/account/register", {
          method: "POST",
          body: JSON.stringify({
            email: USER_1.email,
            username,
            password: USER_1.password,
            rePassword: USER_1.password,
            languages: USER_1.languages,
          }),
        });
        assertEquals(status, 400);
        assertEquals(data, undefined);
        assertEquals(message, "Invalid email, username or password!");
      }
    });
    it("try to register with non valid language", async () => {
      const { status, data, message } = await fetcher("/account/register", {
        method: "POST",
        body: JSON.stringify({
          email: USER_1.email,
          username: USER_1.username,
          password: USER_1.password,
          rePassword: USER_1.password,
          languages: [INVALID_LANGUAGE],
        }),
      });
      assertEquals(status, 400);
      assertEquals(data, undefined);
      assertEquals(message, "Language is not valid!");
    });
  });
  describe("valid register", () => {
    it("register", async () => {
      const { status, data, message } = await fetcher("/account/register", {
        method: "POST",
        body: JSON.stringify({
          email: USER_1.email,
          username: USER_1.username,
          password: USER_1.password,
          rePassword: USER_1.password,
          languages: USER_1.languages,
        }),
      });
      assertEquals(status, 200);
      assertEquals(data, undefined);
      assertEquals(message, undefined);
    });

    it("checks that user is counted on public count", async () => {
      const { status, data } = await fetcher("/user/count");
      assertEquals(status, 200);
      assertEquals(data, { count: 1 });
    });

    it("try to register a valid account with the same username as one existing", async () => {
      const { status, data, message } = await fetcher("/account/register", {
        method: "POST",
        body: JSON.stringify({
          email: "test@test.com",
          username: USER_1.username,
          password: USER_1.password,
          rePassword: USER_1.password,
          languages: USER_1.languages,
        }),
      });
      assertEquals(status, 409);
      assertEquals(data, undefined);
      assertEquals(message, "Username or email already in use!");
    });

    it("try to register a valid account with the same email as one existing", async () => {
      const { status, data, message } = await fetcher("/account/register", {
        method: "POST",
        body: JSON.stringify({
          email: USER_1.email,
          username: "jaskdjkals",
          password: USER_1.password,
          rePassword: USER_1.password,
          languages: USER_1.languages,
        }),
      });
      assertEquals(status, 409);
      assertEquals(data, undefined);
      assertEquals(message, "Username or email already in use!");
    });
  });
});
