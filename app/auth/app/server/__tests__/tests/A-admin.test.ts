import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { USER_1, USER_2 } from "../consts.ts";

import { STATE } from "../state.ts";

describe("10. admin", () => {
  it("claim admin first time", async () => {
    const { status } = await fetcher(`/admin`, {
      method: "POST",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(status, 200);
  });
  it("cannot claim admin when already admins", async () => {
    const { status } = await fetcher(`/admin`, {
      method: "POST",
      headers: STATE.getSessionHeaders(USER_2.email),
    });
    assertEquals(status, 403);
  });
  it("get tokens", async () => {
    const { status, data } = await fetcher(`/admin/tokens`, {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(status, 200);
    assertEquals(data.tokens.length, 0);
  });
  it("add a token", async () => {
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
  it("get tokens", async () => {
    const { status, data } = await fetcher(`/admin/tokens`, {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });

    const { token } = STATE.getObject();

    assertEquals(status, 200);
    assertEquals(data.tokens.length, 1);
    assertEquals(data.tokens[0].id, token.id);
    assertEquals(data.tokens[0].label, "test token");
  });
  it("try to delete token without permission", async () => {
    const { token } = STATE.getObject();
    const { status } = await fetcher(`/admin/tokens?id=${token.id}`, {
      method: "DELETE",
    });
    assertEquals(status, 403);
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
  it("get users", async () => {
    const { status, data } = await fetcher(`/admin/users`, {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(status, 200);
    assertEquals(data.users.length, 2);

    const [user1, user2] = data.users;

    assertEquals(Object.keys(user1).length, 9);
    assertEquals(user1.accountId, STATE.getUser(USER_2.email).accountId);
    assertEquals(user1.admin, false);
    assertEquals(user1.email, USER_2.email.toLowerCase());
    assertEquals(user1.languages, USER_2.languages);
    assertEquals(user1.otp, false);
    assertEquals(user1.username, USER_2.username);
    assertEquals(user1.verified, true);
    assertExists(user1.createdAt);
    assertExists(user1.updatedAt);

    assertEquals(Object.keys(user2).length, 9);
    assertEquals(user2.accountId, STATE.getUser(USER_1.email).accountId);
    assertEquals(user2.admin, true);
    assertEquals(user2.email, USER_1.email.toLowerCase());
    assertEquals(user2.languages, USER_1.languages);
    assertEquals(user2.otp, false);
    assertEquals(user2.username, USER_1.username);
    assertEquals(user2.verified, true);
    assertExists(user2.createdAt);
    assertExists(user2.updatedAt);
  });
  it("update user", async () => {
    const { accountId } = STATE.getUser(USER_2.email);
    const { status } = await fetcher(`/admin/user`, {
      method: "PATCH",
      headers: STATE.getSessionHeaders(USER_1.email),
      body: JSON.stringify({
        accountId,
        username: "test",
        email: "test@test.com",
        createdAt: new Date(1994, 3, 19).getTime(),
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

    assertEquals(Object.keys(user).length, 9);
    assertEquals(user.accountId, STATE.getUser(USER_2.email).accountId);
    assertEquals(user.admin, false);
    assertEquals(user.email, "test@test.com");
    assertEquals(user.languages, USER_2.languages);
    assertEquals(user.otp, false);
    assertEquals(user.username, "test");
    assertEquals(user.verified, true);
    assertEquals(user.createdAt, new Date(1994, 3, 19).getTime());
    assertExists(user.updatedAt);
  });
  it("delete user", async () => {
    const { accountId } = STATE.getUser(USER_2.email);
    const { status } = await fetcher(`/admin/user`, {
      method: "DELETE",
      headers: STATE.getSessionHeaders(USER_1.email),
      body: JSON.stringify({
        accountId,
      }),
    });
    assertEquals(status, 200);

    const response = await fetcher(`/admin/users`, {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(response.status, 200);
    assertEquals(response.data.users.length, 1);

    const user = response.data.users.find(
      (user: any) => user.accountId === accountId,
    );

    assertEquals(user, undefined);
  });
});
