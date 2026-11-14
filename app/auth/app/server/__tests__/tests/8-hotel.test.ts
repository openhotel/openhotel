import { describe, it } from "jsr:@std/testing/bdd";
import {
  assertEquals,
  assertExists,
  assertArrayIncludes,
} from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { HOTEL_1, HOTEL_2, USER_1, USER_2 } from "../consts.ts";

import { STATE } from "../state.ts";

describe("8. hotel", () => {
  describe("hotel creation", () => {
    describe("hotel", () => {
      it("gets empty hotel list", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        });
        assertEquals(status, 200);
        assertEquals(data, {
          hotels: [],
        });
      });
      it("gets empty public hotel list", async () => {
        const { status, data } = await fetcher("/hotel/list", {
          method: "GET",
        });
        assertEquals(status, 200);
        assertEquals(data, {
          hotels: [],
        });
      });
      it("create incorrect hotel", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "POST",
          headers: STATE.getSessionHeaders(USER_1.email),
        });
        assertEquals(status, 400);
        assertEquals(data, undefined);
      });
      it("create valid hotel", async () => {
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
      it("gets hotel list", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        });
        assertEquals(status, 200);
        assertEquals(data.hotels.length, 1);

        const [hotel] = data.hotels;

        const keys = Object.keys(hotel);
        const currentKeys = [
          "accountId",
          "accounts",
          "createdAt",
          "hotelId",
          "integrations",
          "name",
          "public",
          "updatedAt",
          "blocked",
          "verified",
          "official",
        ];

        assertEquals(keys.length, currentKeys.length);
        assertArrayIncludes(Object.keys(hotel), currentKeys);

        assertEquals(hotel.accountId, STATE.getUser(USER_1.email).accountId);
        assertEquals(hotel.hotelId, STATE.getHotel(HOTEL_1.name).hotelId);
        assertEquals(hotel.integrations, []);
        assertEquals(hotel.accounts, 0);
        assertEquals(hotel.name, HOTEL_1.name);
        assertEquals(hotel.public, false);
        assertEquals(hotel.blocked, false);
        assertEquals(hotel.verified, false);
        assertEquals(hotel.official, false);
      });
      it("unauthorized user gets hotel list", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_2.email),
        });
        assertEquals(status, 200);
        assertEquals(data.hotels.length, 0);
      });

      it("gets empty public hotel list", async () => {
        const { status, data } = await fetcher("/hotel/list", {
          method: "GET",
        });
        assertEquals(status, 200);
        assertEquals(data, {
          hotels: [],
        });
      });
      it("unauthorized user tries to makes hotel public and change the name", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "PATCH",
          headers: STATE.getSessionHeaders(USER_2.email),
          body: JSON.stringify({
            hotelId: STATE.getHotel(HOTEL_1.name).hotelId,
            name: "HACKED",
            public: true,
          }),
        });
        assertEquals(status, 400);
        assertEquals(data, undefined);
      });
      it("makes hotel public and change the name", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "PATCH",
          headers: STATE.getSessionHeaders(USER_1.email),
          body: JSON.stringify({
            hotelId: STATE.getHotel(HOTEL_1.name).hotelId,
            name: "PUBLIC HOTEL",
            public: true,
          }),
        });
        assertEquals(status, 200);
        assertEquals(data, undefined);
      });
      it("gets empty public hotel list", async () => {
        const { status, data } = await fetcher("/hotel/list", {
          method: "GET",
        });
        assertEquals(status, 200);
        assertEquals(data, {
          hotels: [],
        });
      });
    });
    describe("integration", () => {
      it("create invalid integration with unauthorized hotel", async () => {
        const { status, data } = await fetcher("/user/@me/hotel/integration", {
          method: "POST",
          headers: STATE.getSessionHeaders(USER_2.email),
          body: JSON.stringify({
            hotelId: STATE.getHotel(HOTEL_1.name).hotelId,
            name: "hacked integration",
            redirectUrl: "http://localhost:1994",
            type: "web",
          }),
        });
        assertEquals(status, 400);
        assertEquals(data, undefined);
      });
      it("create integration with invalid redirectUrl", async () => {
        const { status, data } = await fetcher("/user/@me/hotel/integration", {
          method: "POST",
          headers: STATE.getSessionHeaders(USER_1.email),
          body: JSON.stringify({
            hotelId: STATE.getHotel(HOTEL_1.name).hotelId,
            name: "integration 1",
            redirectUrl: "htalhost94",
            type: "web",
          }),
        });
        assertEquals(status, 400);
        assertEquals(data, undefined);
      });
      it("create integration with invalid type", async () => {
        const { status, data } = await fetcher("/user/@me/hotel/integration", {
          method: "POST",
          headers: STATE.getSessionHeaders(USER_1.email),
          body: JSON.stringify({
            hotelId: STATE.getHotel(HOTEL_1.name).hotelId,
            name: "integration 1",
            redirectUrl: "http://localhost:1994",
            type: "asdad",
          }),
        });
        assertEquals(status, 400);
        assertEquals(data, undefined);
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
      it("gets hotel containing integrations", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        });
        assertEquals(status, 200);
        assertEquals(data.hotels.length, 1);
        assertEquals(data.hotels[0].integrations.length, 1);

        const [integration] = data.hotels[0].integrations;

        const keys = Object.keys(integration);
        const currentKeys: string[] = [
          "integrationId",
          "name",
          "redirectUrl",
          "type",
          "createdAt",
          "updatedAt",
          "accounts",
        ];

        assertEquals(keys.length, currentKeys.length);
        assertArrayIncludes(Object.keys(integration), currentKeys);

        assertEquals(
          integration.integrationId,
          STATE.getHotel(HOTEL_1.name).integrationId,
        );
        assertEquals(integration.name, HOTEL_1.integration_1.name);
        assertEquals(
          integration.redirectUrl,
          HOTEL_1.integration_1.redirectUrl,
        );
        assertEquals(integration.type, HOTEL_1.integration_1.type);
        assertEquals(integration.accounts, 0);
      });
      it("create a new integration", async () => {
        const { status, data } = await fetcher("/user/@me/hotel/integration", {
          method: "POST",
          headers: STATE.getSessionHeaders(USER_1.email),
          body: JSON.stringify({
            hotelId: STATE.getHotel(HOTEL_1.name).hotelId,
            name: "deleteme integration",
            redirectUrl: HOTEL_1.integration_1.redirectUrl,
            type: "web",
          }),
        });
        assertEquals(status, 200);
        assertExists(data.integrationId);
      });
      it("cannot create a new integration", async () => {
        const res1 = await fetcher("/user/@me/hotel/integration", {
          method: "POST",
          headers: STATE.getSessionHeaders(USER_1.email),
          body: JSON.stringify({
            hotelId: STATE.getHotel(HOTEL_1.name).hotelId,
            name: "deleteme integration",
            redirectUrl: HOTEL_1.integration_1.redirectUrl,
            type: "web",
          }),
        });
        assertEquals(res1.status, 400);
        assertEquals(res1.data, undefined);

        const res2 = await fetcher("/user/@me/hotel/integration", {
          method: "POST",
          headers: STATE.getSessionHeaders(USER_1.email),
          body: JSON.stringify({
            hotelId: STATE.getHotel(HOTEL_1.name).hotelId,
            name: "deleteme integration",
            redirectUrl: HOTEL_1.integration_1.redirectUrl,
            type: "client",
          }),
        });
        assertEquals(res2.status, 400);
        assertEquals(res2.data, undefined);
      });
      it("gets hotel containing integrations", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        });
        assertEquals(status, 200);
        assertEquals(data.hotels.length, 1);
        assertEquals(data.hotels[0].integrations.length, 2);
      });
      it("get public hotel integration", async () => {
        const { status, data } = await fetcher("/hotel/list", {
          method: "GET",
        });
        assertEquals(status, 200);
        assertEquals(data, {
          hotels: [],
        });
      });
      it("generate integration license", async () => {
        const hotel = STATE.getHotel(HOTEL_1.name);

        const { status, data } = await fetcher(
          `/user/@me/hotel/integration?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
          {
            method: "GET",
            headers: STATE.getSessionHeaders(USER_1.email),
          },
        );
        assertEquals(status, 200);
        assertExists(data.token);

        STATE.setHotel(HOTEL_1.name, {
          licenseToken: data.token,
        });
      });
      it("check hotel integration license", async () => {
        const { status, data } = await fetcher(`/hotel/license`, {
          method: "GET",
          headers: {
            "license-token": STATE.getHotel(HOTEL_1.name).licenseToken,
          },
        });
        assertEquals(status, 200);
        assertEquals(Object.keys(data).length, 3);
        assertExists(data.accountId);
        assertExists(data.hotelId);
        assertExists(data.integrationId);
      });
      it("check invalid hotel integration license", async () => {
        const { status } = await fetcher(`/hotel/license`, {
          method: "GET",
          headers: {
            "license-token": "asdasdasdasd",
          },
        });
        assertEquals(status, 403);
      });
      it("generate a new integration license", async () => {
        const hotel = STATE.getHotel(HOTEL_1.name);

        const { status, data } = await fetcher(
          `/user/@me/hotel/integration?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
          {
            method: "GET",
            headers: STATE.getSessionHeaders(USER_1.email),
          },
        );
        assertEquals(status, 200);
        assertExists(data.token);

        STATE.setHotel(HOTEL_1.name, {
          licenseToken2: data.token,
        });
      });
      it("check hotel integration license doesn't work anymore", async () => {
        const { status, data } = await fetcher(`/hotel/license`, {
          method: "GET",
          headers: {
            "license-token": STATE.getHotel(HOTEL_1.name).licenseToken,
          },
        });
        assertEquals(status, 403);
        assertEquals(data, undefined);
      });
      it("check new hotel integration license work", async () => {
        const { status, data } = await fetcher(`/hotel/license`, {
          method: "GET",
          headers: {
            "license-token": STATE.getHotel(HOTEL_1.name).licenseToken2,
          },
        });
        assertEquals(status, 200);
        assertExists(data);
      });
      it("delete integration", async () => {
        const hotel = STATE.getHotel(HOTEL_1.name);

        const { status, data } = await fetcher(
          `/user/@me/hotel/integration?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
          {
            method: "DELETE",
            headers: STATE.getSessionHeaders(USER_1.email),
          },
        );
        assertEquals(status, 200);
        assertEquals(data, undefined);
      });
      it("check new hotel integration license doesnt work anymore", async () => {
        const { status, data } = await fetcher(`/hotel/license`, {
          method: "GET",
          headers: {
            "license-token": STATE.getHotel(HOTEL_1.name).licenseToken2,
          },
        });
        assertEquals(status, 403);
        assertEquals(data, undefined);
      });
    });
    describe("hotel - part 2", () => {
      it("create hotel", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "POST",
          headers: STATE.getSessionHeaders(USER_1.email),
          body: JSON.stringify({
            name: HOTEL_2.name,
            public: true,
          }),
        });
        assertEquals(status, 200);
        assertExists(data.hotelId);

        STATE.setHotel(HOTEL_2.name, { hotelId: data.hotelId });
      });
      it("gets hotel", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        });
        assertEquals(status, 200);
        assertEquals(data.hotels.length, 2);
      });
      it("delete hotel", async () => {
        const { status, data } = await fetcher(
          `/user/@me/hotel?hotelId=${STATE.getHotel(HOTEL_2.name).hotelId}`,
          {
            method: "DELETE",
            headers: STATE.getSessionHeaders(USER_1.email),
          },
        );
        assertEquals(status, 200);
        assertEquals(data, undefined);
      });
      it("delete a deleted hotel", async () => {
        const { status, data } = await fetcher(
          `/user/@me/hotel?hotelId=${STATE.getHotel(HOTEL_2.name).hotelId}`,
          {
            method: "DELETE",
            headers: STATE.getSessionHeaders(USER_1.email),
          },
        );
        assertEquals(status, 400);
        assertEquals(data, undefined);
      });
      it("gets hotel", async () => {
        const { status, data } = await fetcher("/user/@me/hotel", {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_1.email),
        });
        assertEquals(status, 200);
        assertEquals(data.hotels.length, 1);
      });
      it("create valid integration", async () => {
        const { status, data } = await fetcher("/user/@me/hotel/integration", {
          method: "POST",
          headers: STATE.getSessionHeaders(USER_1.email),
          body: JSON.stringify({
            hotelId: STATE.getHotel(HOTEL_1.name).hotelId,
            name: HOTEL_1.integration_1.name,
            redirectUrl: HOTEL_1.integration_1.redirectUrl,
            type: "client",
          }),
        });
        assertEquals(status, 200);
        assertExists(data.integrationId);

        STATE.setHotel(HOTEL_1.name, { integrationId: data.integrationId });
      });
      it("generate integration license", async () => {
        const hotel = STATE.getHotel(HOTEL_1.name);

        const { status, data } = await fetcher(
          `/user/@me/hotel/integration?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
          {
            method: "GET",
            headers: STATE.getSessionHeaders(USER_1.email),
          },
        );
        assertEquals(status, 200);
        assertExists(data.token);

        STATE.setHotel(HOTEL_1.name, {
          licenseToken: data.token,
        });
      });
    });
  });
});
