import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { HOTEL_1, USER_1, USER_2 } from "../consts.ts";

import { STATE } from "../state.ts";

describe("14. delete account", () => {
  it("register a new user", async () => {
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
  it("login new user", async () => {
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
  it("connect new user to hotel", async () => {
    const hotel = STATE.getHotel(HOTEL_1.name);

    const { status, data } = await fetcher(`/user/@me/connection`, {
      method: "POST",
      headers: STATE.getSessionHeaders(USER_2.email),
      body: JSON.stringify({
        hotelId: hotel.hotelId,
        integrationId: hotel.integrationId,
        scopes: USER_2.connectionScopes,
        state: "RANDOM_STATE",
      }),
    });
    assertEquals(status, 200);
    assertExists(data.redirectUrl);

    const connectionURL = new URL(data.redirectUrl);

    //@ts-ignore
    const connectionId = connectionURL.searchParams.get("token").split(".")[1];
    STATE.setUser(USER_2.email, { connectionId });
  });
  it("delete main user", async () => {
    const { status } = await fetcher("/account", {
      method: "DELETE",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(status, 200);
  });
  it("get user count", async () => {
    const { status, data } = await fetcher("/user/count");
    assertEquals(status, 200);
    assertEquals(data, { count: 1 });
  });
  it("get public hotel list", async () => {
    const { status, data } = await fetcher("/hotel/list");
    assertEquals(status, 200);
    assertEquals(data.hotels.length, 0);
  });
  it("delete user", async () => {
    const { status } = await fetcher("/account", {
      method: "DELETE",
      headers: STATE.getSessionHeaders(USER_2.email),
    });
    assertEquals(status, 200);
  });
  it("check user count", async () => {
    const { status, data } = await fetcher("/user/count");
    assertEquals(status, 200);
    assertEquals(data, { count: 0 });
  });
});
