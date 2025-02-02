import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { INVALID_LANGUAGE, USER_1 } from "../consts.ts";

import { STATE } from "../state.ts";
import { LANGUAGE_LIST } from "../../src/shared/consts/language.consts.ts";

describe("8. user", () => {
  describe("get and update user", () => {
    it("Get data from @me", async () => {
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
    it("Update languages to user with invalid one", async () => {
      const { status } = await fetcher("/user/@me", {
        method: "PATCH",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          languages: [INVALID_LANGUAGE],
        }),
      });
      assertEquals(status, 400);
    });
    it("Update languages", async () => {
      let { status } = await fetcher("/user/@me", {
        method: "PATCH",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          languages: [LANGUAGE_LIST[4]],
        }),
      });
      assertEquals(status, 200);

      let userMeResponse = await fetcher("/user/@me", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(userMeResponse.status, 200);
      assertEquals(userMeResponse.data, {
        accountId: STATE.getUser(USER_1.email).accountId,
        languages: [LANGUAGE_LIST[4]],
        username: USER_1.username,
      });

      const meResponse = await fetcher("/user/@me", {
        method: "PATCH",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          languages: USER_1.languages,
        }),
      });
      assertEquals(meResponse.status, 200);

      userMeResponse = await fetcher("/user/@me", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(userMeResponse.status, 200);
      assertEquals(userMeResponse.data, {
        accountId: STATE.getUser(USER_1.email).accountId,
        languages: USER_1.languages,
        username: USER_1.username,
      });
    });
  });
  it("Get email from @me", async () => {
    const { status, data } = await fetcher("/user/@me/email", {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(status, 200);
    assertEquals(data, {
      email: USER_1.email.toLowerCase(),
    });
  });

  it("Get connections", async () => {
    const { status, data } = await fetcher("/user/@me/connection", {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(status, 200);
    assertEquals(data, {
      connections: [],
    });
  });
  it("Get hotels", async () => {
    const { status, data } = await fetcher("/user/@me/hotel", {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(status, 200);
    assertEquals(data, {
      hotels: [],
    });
  });
});
