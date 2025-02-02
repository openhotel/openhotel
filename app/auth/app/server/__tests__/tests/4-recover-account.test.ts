import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { INVALID_EMAILS, USER_1 } from "../consts.ts";

import { STATE } from "../state.ts";

describe("5. recover account", () => {
  describe("recovery", () => {
    it("recovers with empty email", async () => {
      const { status, data, message } = await fetcher(
        "/account/recover-password",
        {
          method: "POST",
        },
      );
      assertEquals(status, 400);
      assertEquals(data, undefined);
      assertEquals(message, undefined);
    });
    it("recovers with incorrect email", async () => {
      const { status, data, message } = await fetcher(
        "/account/recover-password",
        {
          method: "POST",
          body: JSON.stringify({
            email: INVALID_EMAILS[1],
          }),
        },
      );
      assertEquals(status, 400);
      assertEquals(data, undefined);
      assertEquals(message, "Invalid email");
    });
    it("recovers a valid email but without an account", async () => {
      const { status, data, message, redirectUrl } = await fetcher(
        "/account/recover-password",
        {
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
          }),
        },
      );
      assertEquals(status, 200);
      assertEquals(data, undefined);
      assertEquals(message, undefined);
      assertEquals(redirectUrl, undefined);
    });
    it("recovers a valid email", async () => {
      const { status, data, message, redirectUrl } = await fetcher(
        "/account/recover-password",
        {
          method: "POST",
          body: JSON.stringify({
            email: USER_1.email,
          }),
        },
      );
      assertEquals(status, 200);
      assertEquals(data, undefined);
      assertEquals(message, undefined);
      assertExists(redirectUrl);

      const url = new URL(redirectUrl);

      STATE.setUser(USER_1.email, {
        recoverToken: url.searchParams.get("token"),
      });
    });
  });
  describe("change password", () => {
    it("change password on invalid token", async () => {
      const { status, data, message } = await fetcher(
        "/account/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            password: "nidc0Utp}_Da*($P}",
            rePassword: "nidc0Utp}_Da*($P}",
            token: "asdljkasldkjsa",
          }),
        },
      );
      assertEquals(status, 400);
      assertEquals(data, undefined);
      assertEquals(
        message,
        "Recover password request has expired, please send a new one",
      );
    });
    it("change invalid password on valid token", async () => {
      const { status, data, message } = await fetcher(
        "/account/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            password: "nidc0Utp}_Da*($P}",
            rePassword: "nidc0Utp",
            token: STATE.getUser(USER_1.email).recoverToken,
          }),
        },
      );
      assertEquals(status, 400);
      assertEquals(data, undefined);
      assertEquals(message, "Invalid password");
    });
    it("change password on valid token", async () => {
      const { status, data, message } = await fetcher(
        "/account/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            password: USER_1.password,
            rePassword: USER_1.password,
            token: STATE.getUser(USER_1.email).recoverToken,
          }),
        },
      );
      assertEquals(status, 200);
      assertEquals(data, undefined);
      assertEquals(message, undefined);
    });
    it("change password on an expired token", async () => {
      const { status, data, message } = await fetcher(
        "/account/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            password: USER_1.password,
            rePassword: USER_1.password,
            token: STATE.getUser(USER_1.email).recoverToken,
          }),
        },
      );
      assertEquals(status, 400);
      assertEquals(data, undefined);
      assertEquals(
        message,
        "Recover password request has expired, please send a new one",
      );
    });
  });
});
