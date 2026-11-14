import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";
import { STATE } from "../state.ts";
import { HOTEL_1, USER_1, USER_2 } from "../consts.ts";
import { fetcher } from "../utils.ts";

describe("13. account with restrictions", () => {
  it("adds restrictions to user", async () => {
    const currentDate = Date.now();

    const { accountId } = STATE.getUser(USER_2.email);
    const { status } = await fetcher(`/admin/user`, {
      method: "PATCH",
      headers: STATE.getSessionHeaders(USER_1.email),
      body: JSON.stringify({
        accountId,
        username: "test",
        email: USER_2.email,
        createdAt: new Date(1994, 3, 19).getTime(),
        restrictions: [currentDate, "0x6001"],
      }),
    });
    assertEquals(status, 200);

    const response = await fetcher(`/admin/users`, {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(response.status, 200);
    assertEquals(response.data.users.length, 2);

    const user = response.data.users.find(
      (user: any) => user.accountId === accountId,
    );

    assertEquals(Object.keys(user).length, 10);
    assertEquals(user.accountId, STATE.getUser(USER_2.email).accountId);
    assertEquals(user.restrictions, [currentDate, "0x6001"]);
    assertExists(user.updatedAt);
  });
  describe("otp", () => {
    it("fail to retrieve the otp verifier", async () => {
      const { status } = await fetcher("/account/otp", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_2.email),
      });
      assertEquals(status, 403);
    });
    it("fail to verify otp token", async () => {
      const { status } = await fetcher("/account/otp/verify?token=000000", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_2.email),
      });
      assertEquals(status, 403);
    });
    it("fail to delete the otp verifier", async () => {
      const { status } = await fetcher("/account/otp", {
        method: "DELETE",
        headers: STATE.getSessionHeaders(USER_2.email),
      });
      assertEquals(status, 403);
    });
  });
  describe("account", () => {
    it("fail to recover password", async () => {
      const { status } = await fetcher("/account/recover-password", {
        method: "POST",
        body: JSON.stringify({
          email: USER_2.email,
        }),
      });
      assertEquals(status, 429);
    });
  });
  describe("hotels", () => {
    it("fails to get hotel list", async () => {
      const { status } = await fetcher("/user/@me/hotel", {
        method: "GET",
        headers: STATE.getSessionHeaders(USER_2.email),
      });
      assertEquals(status, 403);
    });
    it("fails to create hotel", async () => {
      const { status } = await fetcher("/user/@me/hotel", {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_2.email),
        body: JSON.stringify({
          name: HOTEL_1.name,
          public: false,
        }),
      });
      assertEquals(status, 403);
    });
  });
  describe("connections", () => {
    it("fail to retrieve user connection", async () => {
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status } = await fetcher(
        `/user/@me/connection?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
        {
          method: "GET",
          headers: STATE.getSessionHeaders(USER_2.email),
        },
      );
      assertEquals(status, 403);
    });
    it("fail to create user connection", async () => {
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status } = await fetcher(`/user/@me/connection`, {
        method: "POST",
        headers: STATE.getSessionHeaders(USER_2.email),
        body: JSON.stringify({
          hotelId: hotel.hotelId,
          integrationId: hotel.integrationId,
          scopes: USER_2.connectionScopes,
          state: "RANDOM_STATE",
        }),
      });
      assertEquals(status, 403);
    });
    it("fail to delete connection", async () => {
      const hotel = STATE.getHotel(HOTEL_1.name);

      const { status } = await fetcher(
        `/user/@me/connection?hotelId=${hotel.hotelId}&integrationId=${hotel.integrationId}`,
        {
          method: "DELETE",
          headers: STATE.getSessionHeaders(USER_2.email),
        },
      );
      assertEquals(status, 403);
    });
  });
});
