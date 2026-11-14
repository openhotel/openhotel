import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { USER_1 } from "../consts.ts";

import { STATE } from "../state.ts";

describe("5. otp account", () => {
  describe("set to account", () => {
    it("retrieve the otp verifier", async () => {
      const { status, data } = await fetcher("/account/otp", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(status, 200);
      assertExists(data.uri);

      STATE.setUser(USER_1.email, { otpUri: data.uri });
    });
    it("verify invalid otp token", async () => {
      const { status, data } = await fetcher(
        "/account/otp/verify?token=000000",
        {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 400);
      assertEquals(data, undefined);
    });
    it("verify valid otp token", async () => {
      const token = STATE.generateOtp(USER_1.email);
      const { status, data } = await fetcher(
        `/account/otp/verify?token=${token}`,
        {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 200);
      assertEquals(data, undefined);
    });
    it("retrieve the otp verifier doesn't generate a new uri", async () => {
      const { status, data } = await fetcher("/account/otp", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(status, 409);
      assertEquals(data, undefined);
    });
  });
  describe("login", () => {
    it("login without otp", async () => {
      const { status, data } = await fetcher("/account/login", {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          email: USER_1.email,
          password: USER_1.password,
        }),
      });
      assertEquals(status, 441);
      assertEquals(data, undefined);
    });
    it("login with an invalid otp", async () => {
      const { status, data } = await fetcher("/account/login", {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          email: USER_1.email,
          password: USER_1.password,
          otpToken: "000000",
        }),
      });
      assertEquals(status, 441);
      assertEquals(data, undefined);
    });
    it("login with an valid otp", async () => {
      const { status, data } = await fetcher("/account/login", {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          email: USER_1.email,
          password: USER_1.password,
          otpToken: STATE.generateOtp(USER_1.email),
        }),
      });
      assertEquals(status, 200);
      assertExists(data.accountId);
      assertExists(data.durations);
      assertExists(data.refreshToken);
      assertExists(data.token);
    });
    it("check if session token doesn't work anymore", async () => {
      const { status } = await fetcher("/user/@me", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(status, 403);
    });
    it("login with an valid otp (x2)", async () => {
      const { status, data } = await fetcher("/account/login", {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          email: USER_1.email,
          password: USER_1.password,
          otpToken: STATE.generateOtp(USER_1.email),
        }),
      });
      assertEquals(status, 200);
      assertExists(data.accountId);
      assertExists(data.durations);
      assertExists(data.refreshToken);
      assertExists(data.token);

      STATE.setUser(USER_1.email, data);
    });
  });
  describe("delete and login", () => {
    it("delete the otp verifier", async () => {
      const { status } = await fetcher("/account/otp", {
        method: "DELETE",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(status, 200);

      STATE.setUser(USER_1.email, { otpUri: null });
    });
    it("retrieve the otp verifier", async () => {
      const { status, data } = await fetcher("/account/otp", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(status, 200);
      assertExists(data.uri);
    });
    it("login without otp", async () => {
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
  });
});
