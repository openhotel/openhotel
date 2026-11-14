import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";
import { STATE } from "../state.ts";
import { USER_1, USER_2 } from "../consts.ts";
import { fetcher } from "../utils.ts";

describe("12. login with a blocked account", () => {
  it("login with a non blocked account", async () => {
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
  });
  it("blocks user", async () => {
    const { accountId } = STATE.getUser(USER_2.email);
    const { status } = await fetcher(`/admin/user`, {
      method: "PATCH",
      headers: STATE.getSessionHeaders(USER_1.email),
      body: JSON.stringify({
        accountId,
        username: "test",
        email: "test@test.com",
        createdAt: new Date(1994, 3, 19).getTime(),
        blocked: true,
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
    assertEquals(user.blocked, true);
    assertExists(user.updatedAt);
  });
  it("try to login with a blocked account", async () => {
    const { status } = await fetcher("/account/login", {
      method: "POST",
      headers: STATE.getSessionHeaders(USER_2.email),
      body: JSON.stringify({
        email: USER_2.email,
        password: USER_2.password,
      }),
    });
    assertEquals(status, 400);
  });
  it("unblock user", async () => {
    const { accountId } = STATE.getUser(USER_2.email);
    const { status } = await fetcher(`/admin/user`, {
      method: "PATCH",
      headers: STATE.getSessionHeaders(USER_1.email),
      body: JSON.stringify({
        accountId,
        username: "test",
        email: USER_2.email,
        createdAt: new Date(1994, 3, 19).getTime(),
        blocked: false,
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
    assertEquals(user.blocked, false);
    assertExists(user.updatedAt);
  });
  it("login with a non blocked account", async () => {
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
  });
});
