import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { HOTEL_1, USER_1 } from "../consts.ts";

import { STATE } from "../state.ts";
import { wait } from "../../src/shared/utils/wait.utils.ts";

describe("9. user connection hotel", () => {
  describe("user connection", () => {
    it("cannot retrieve user connection", async () => {
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status, data } = await fetcher(
        `/user/@me/connection?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
        {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 404);
      assertEquals(data, undefined);
    });
    it("create user connection with invalid scopes", async () => {
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status, data } = await fetcher(`/user/@me/connection`, {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_1.email),
        body: JSON.stringify({
          hotelId: hotel.hotelId,
          integrationId: hotel.integrationId,
          scopes: ["INVALID_SCOPE"],
          state: "RANDOM_STATE",
        }),
      });
      assertEquals(status, 400);
      assertEquals(data, undefined);
    });
    it("create user connection", async () => {
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

      const url = new URL(data.redirectUrl);
      const state = url.searchParams.get("state");
      const token = url.searchParams.get("token");
      const scopes = url.searchParams.get("scopes");

      assertEquals(state, "RANDOM_STATE");
      assertExists(token);
      assertEquals(scopes, USER_1.connectionScopes.join(","));
    });
    it("get user connection", async () => {
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status, data } = await fetcher(
        `/user/@me/connection?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
        {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 200);

      const { connection } = data;

      assertExists(connection);
      assertEquals(Object.keys(connection).length, 10);
      assertEquals(connection.active, true);
      assertEquals(connection.hotelId, hotel.hotelId);
      assertEquals(connection.hotelName, "PUBLIC HOTEL");
      assertEquals(connection.integrationId, hotel.integrationId);
      assertEquals(connection.name, HOTEL_1.integration_1.name);
      assertEquals(connection.owner, USER_1.username);
      assertEquals(connection.redirectUrl, HOTEL_1.integration_1.redirectUrl);
      assertEquals(connection.scopes, USER_1.connectionScopes);
      assertEquals(connection.type, "client");
      assertEquals(connection.verified, false);
    });
    it("delete connection", async () => {
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status } = await fetcher(
        `/user/@me/connection?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
        {
          method: "DELETE",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 200);
    });
    it("cannot retrieve user connection", async () => {
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status, data } = await fetcher(
        `/user/@me/connection?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
        {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 404);
      assertEquals(data, undefined);
    });
    it("hotel cannot retrieve @me", async () => {
      const { status, data } = await fetcher("/user/@me", {
        method: "GET",
        headers: {
          "license-token": STATE.getHotel(HOTEL_1.name).licenseToken,
          "account-id": STATE.getUser(USER_1.email).accountId,
        },
      });
      assertEquals(status, 403);
      assertEquals(data, undefined);
    });
    it("hotel cannot retrieve @me/scopes", async () => {
      const { status, data } = await fetcher("/user/@me/scopes", {
        method: "GET",
        headers: {
          "license-token": STATE.getHotel(HOTEL_1.name).licenseToken,
          "account-id": STATE.getUser(USER_1.email).accountId,
        },
      });
      assertEquals(status, 403);
      assertEquals(data, undefined);
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
      const connectionId = connectionURL.searchParams
        .get("token")
        .split(".")[1];
      STATE.setUser(USER_1.email, { connectionId });
    });
    it("ping to connection with non authorized headers", async () => {
      const { connectionId } = STATE.getUser(USER_1.email);

      const { status, data } = await fetcher(
        `/user/@me/connection/ping?connectionId=${connectionId}`,
        {
          method: "PATCH",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 200);
      assertEquals(data, {
        estimatedNextPingIn: 2500,
      });
    });
    it("ping to invalid connection", async () => {
      const { status, data } = await fetcher(
        `/user/@me/connection/ping?connectionId=asdasdasd`,
        {
          method: "PATCH",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 403);
      assertEquals(data, undefined);
    });
    it("retrieve connectionId from user", async () => {
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status, data } = await fetcher(
        `/user/@me/connection?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
        {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 200);
      assertExists(data);
      assertEquals(data.connection.hotelId, hotel.hotelId);
      assertEquals(data.connection.integrationId, hotel.integrationId);
      assertEquals(data.connection.active, true);
    });
    it("ping to connection again on time", async () => {
      const { connectionId } = STATE.getUser(USER_1.email);
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status, data } = await fetcher(
        `/user/@me/connection/ping?connectionId=${connectionId}`,
        {
          method: "PATCH",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 200);
      assertEquals(data, {
        estimatedNextPingIn: 2500,
      });

      const res = await fetcher(
        `/user/@me/connection?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
        {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(res.status, 200);
      assertExists(data);
      assertEquals(res.data.connection.hotelId, hotel.hotelId);
      assertEquals(res.data.connection.integrationId, hotel.integrationId);
      assertEquals(res.data.connection.active, true);
    });
    it("hotel retrieves @me", async () => {
      const { status, data } = await fetcher("/user/@me", {
        method: "GET",
        headers: {
          "license-token": STATE.getHotel(HOTEL_1.name).licenseToken,
          "account-id": STATE.getUser(USER_1.email).accountId,
        },
      });
      assertEquals(status, 200);
      assertEquals(data, {
        accountId: STATE.getUser(USER_1.email).accountId,
        languages: USER_1.languages,
        username: USER_1.username,
      });
    });
    it("hotel retrieves @me/scopes", async () => {
      const { status, data } = await fetcher("/user/@me/scopes", {
        method: "GET",
        headers: {
          "license-token": STATE.getHotel(HOTEL_1.name).licenseToken,
          "account-id": STATE.getUser(USER_1.email).accountId,
        },
      });
      assertEquals(status, 200);
      assertEquals(data, {
        scopes: USER_1.connectionScopes,
      });
    });
    it("ping to connection and receive an error because exceeded time", async () => {
      await wait(60_000);

      const { connectionId } = STATE.getUser(USER_1.email);
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status, data } = await fetcher(
        `/user/@me/connection/ping?connectionId=${connectionId}`,
        {
          method: "PATCH",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 403);
      assertEquals(data, undefined);

      const res = await fetcher(
        `/user/@me/connection?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
        {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(res.status, 200);
      assertExists(res.data);
      assertEquals(res.data.connection.integrationId, hotel.integrationId);
      assertEquals(res.data.connection.active, false);
    });
    it("hotel cannot retrieve @me", async () => {
      const { status, data } = await fetcher("/user/@me", {
        method: "GET",
        headers: {
          "license-token": STATE.getHotel(HOTEL_1.name).licenseToken,
          "account-id": STATE.getUser(USER_1.email).accountId,
        },
      });
      assertEquals(status, 403);
      assertEquals(data, undefined);
    });
    it("hotel cannot retrieve @me/scopes", async () => {
      const { status, data } = await fetcher("/user/@me/scopes", {
        method: "GET",
        headers: {
          "license-token": STATE.getHotel(HOTEL_1.name).licenseToken,
          "account-id": STATE.getUser(USER_1.email).accountId,
        },
      });
      assertEquals(status, 403);
      assertEquals(data, undefined);
    });
    it("get public hotel list", async () => {
      const { status, data } = await fetcher("/hotel/list");
      assertEquals(status, 200);
      assertEquals(data.hotels.length, 1);

      const [hotel] = data.hotels;

      assertEquals(hotel.accounts, 1);
      assertEquals(hotel.id, STATE.getHotel(HOTEL_1.name).hotelId);
      assertEquals(hotel.name, "PUBLIC HOTEL");
      assertEquals(hotel.owner, USER_1.username);
      assertEquals(hotel.client.name, HOTEL_1.integration_1.name);
      assertEquals(hotel.client.url, HOTEL_1.integration_1.redirectUrl);
      assertEquals(hotel.web.name, "deleteme integration");
      assertEquals(hotel.web.url, HOTEL_1.integration_1.redirectUrl);
      assertExists(hotel.createdAt);
    });
  });
  describe("hotel deleted", () => {
    it("delete hotel", async () => {
      const { status } = await fetcher(
        `/user/@me/hotel?hotelId=${STATE.getHotel(HOTEL_1.name).hotelId}`,
        {
          method: "DELETE",
          headers: STATE.getSessionHeaders(USER_1.email),
        },
      );
      assertEquals(status, 200);
    });
    it("retrieve hotels to be empty", async () => {
      const { status, data } = await fetcher("/user/@me/hotel", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_1.email),
      });
      assertEquals(status, 200);
      assertEquals(data.hotels.length, 0);
    });
    it("try to connect to hotel", async () => {
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
      assertEquals(status, 400);
      assertEquals(data, undefined);
    });
    it("hotel fails to retrieve @me", async () => {
      const { status, data } = await fetcher("/user/@me", {
        method: "GET",
        headers: {
          "license-token": STATE.getHotel(HOTEL_1.name).licenseToken,
          "account-id": STATE.getUser(USER_1.email).accountId,
        },
      });
      assertEquals(status, 403);
      assertEquals(data, undefined);
    });
    it("get public hotel list", async () => {
      const { status, data } = await fetcher("/hotel/list", {
        method: "GET",
      });
      assertEquals(status, 200);
      assertEquals(data, {
        hotels: [],
      });
    });
  });
});
