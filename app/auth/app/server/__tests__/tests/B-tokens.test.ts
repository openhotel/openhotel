import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { HOTEL_1, USER_1 } from "../consts.ts";

import { STATE } from "../state.ts";

describe("13. tokens", () => {
  it("create token", async () => {
    const { status, data } = await fetcher(`/admin/tokens`, {
      method: "POST",
      headers: STATE.getSessionHeaders(USER_1.email),
      body: JSON.stringify({
        label: "test token",
      }),
    });
    assertEquals(status, 200);
    assertEquals(data.label, "test token");
    assertExists(data.id);
    assertExists(data.token);

    STATE.setObject({
      token: {
        id: data.id,
        token: data.token,
      },
    });
  });
  it("check valid token", async () => {
    const { token } = STATE.getObject().token;
    const { status, data } = await fetcher(`/tokens/check`, {
      method: "GET",
      headers: {
        "app-token": token,
      },
    });
    assertEquals(status, 200);
    assertEquals(data, {
      valid: true,
    });
  });
  it("check invalid token", async () => {
    const { status, data } = await fetcher(`/tokens/check`, {
      method: "GET",
      headers: {
        "app-token": "ak;lsd;lkasdk;l",
      },
    });
    assertEquals(status, 403);
    assertEquals(data, undefined);
  });
  it("get invalid user connection from token", async () => {
    const { token } = STATE.getObject().token;
    const { status, data } = await fetcher(
      `/tokens/user/connection?accountId=${STATE.getUser(USER_1.email).accountId}`,
      {
        method: "GET",
        headers: {
          "app-token": token,
        },
      },
    );
    assertEquals(status, 403);
    assertEquals(data, undefined);
  });
  it("create a new hotel", async () => {
    const { status, data } = await fetcher("/user/@me/hotel", {
      method: "POST",
      headers: STATE.getSessionHeaders(USER_1.email),
      body: JSON.stringify({
        name: HOTEL_1.name,
        public: false,
      }),
    });
    assertEquals(status, 200);
    assertExists(data.hotelId);

    STATE.setHotel(HOTEL_1.name, { hotelId: data.hotelId });
  });
  it("create valid integration", async () => {
    const { status, data } = await fetcher("/user/@me/hotel/integration", {
      method: "POST",
      headers: STATE.getSessionHeaders(USER_1.email),
      body: JSON.stringify({
        hotelId: STATE.getHotel(HOTEL_1.name).hotelId,
        name: HOTEL_1.integration_1.name,
        redirectUrl: HOTEL_1.integration_1.redirectUrl,
        type: HOTEL_1.integration_1.type,
      }),
    });
    assertEquals(status, 200);
    assertExists(data.integrationId);

    STATE.setHotel(HOTEL_1.name, {
      integrationId: data.integrationId,
    });
  });
  it("create new connection", async () => {
    const hotel = STATE.getHotel(HOTEL_1.name);

    const { status, data } = await fetcher(`/user/@me/connection`, {
      method: "POST",
      headers: STATE.getSessionHeaders(USER_1.email),
      body: JSON.stringify({
        hotelId: hotel.hotelId,
        integrationId: hotel.integrationId,
        scopes: USER_1.connectionScopes,
        state: "RANDOM_STATE",
      }),
    });
    assertEquals(status, 200);
    assertExists(data.redirectUrl);

    const connectionURL = new URL(data.redirectUrl);

    //@ts-ignore
    const connectionId = connectionURL.searchParams.get("token").split(".")[1];
    STATE.setUser(USER_1.email, { connectionId });
  });
  it("get valid user connection from token", async () => {
    const { token } = STATE.getObject().token;

    const user = STATE.getUser(USER_1.email);
    const hotel = STATE.getHotel(HOTEL_1.name);

    const { status, data } = await fetcher(
      `/tokens/user/connection?accountId=${user.accountId}`,
      {
        method: "GET",
        headers: {
          "app-token": token,
        },
      },
    );
    assertEquals(status, 200);
    assertEquals(data, {
      connection: {
        connectionId: user.connectionId,
        hotelId: hotel.hotelId,
        scopes: USER_1.connectionScopes,
      },
    });
  });
  it("delete token", async () => {
    const { token } = STATE.getObject();
    const { status } = await fetcher(`/admin/tokens?id=${token.id}`, {
      method: "DELETE",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(status, 200);

    const response = await fetcher(`/admin/tokens`, {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });

    assertEquals(response.status, 200);
    assertEquals(response.data.tokens.length, 0);
  });
  it("fail to validate user connection from token", async () => {
    const { token } = STATE.getObject().token;

    const user = STATE.getUser(USER_1.email);

    const { status, data } = await fetcher(
      `/tokens/user/connection?accountId=${user.accountId}`,
      {
        method: "GET",
        headers: {
          "app-token": token,
        },
      },
    );
    assertEquals(status, 403);
    assertEquals(data, undefined);
  });
});
