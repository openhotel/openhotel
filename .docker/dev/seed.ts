import { join } from "@std/path";
import {
  fail,
  getReposDir,
  loadEnv,
  ok,
  readYaml,
  ROOT,
  warn,
  writeYaml,
} from "./utils.ts";

type User = { username: string; email: string; password: string };
type Seed = { users: User[]; hotel: { name: string } };
type Session = Record<string, string>;
type Response<Data> = { status: number; data?: Data; message?: string };

type Integration = {
  name: string;
  redirectUrl: string;
  type: "client" | "web";
};

const AUTH_API = "http://localhost:2024/api/v3";
const MAIL_API = "http://localhost:8025/api/v1";
const FINGERPRINT = "devkit-seed";
const INTEGRATIONS: Record<string, Integration> = {
  client: {
    name: "devkit",
    redirectUrl: "http://localhost:1994",
    type: "client",
  },
  web: {
    name: "devkit-web",
    redirectUrl: "http://localhost:2025",
    type: "web",
  },
};
const ONET_TOKEN_LABEL = "onet";
const ONET_API = "http://localhost:9400/api/v1";
const STATIC_URL = "http://localhost:1995";
const ASSET_EDITOR_URL = "http://localhost:2030";

const request = async <Data>(
  method: string,
  pathname: string,
  { body, headers = {} }: { body?: unknown; headers?: Session } = {},
): Promise<Response<Data>> => {
  const response = await fetch(`${AUTH_API}${pathname}`, {
    method,
    headers: { fingerprint: FINGERPRINT, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  return response.json();
};

const checkAuth = async () => {
  try {
    await request("GET", "/_/version");
  } catch {
    fail(`auth is not running on ${AUTH_API}`);
  }
};

const register = async ({ username, email, password }: User) => {
  const { status, message } = await request("POST", "/account/register", {
    body: {
      username,
      email,
      password,
      rePassword: password,
      languages: ["en"],
    },
  });

  if (status === 200) ok(`${username}: registered`);
  else if (status === 409) ok(`${username}: already registered`);
  else fail(`${username}: register failed (${status} ${message ?? ""})`);
};

const verifyEmail = async ({ username, email }: User) => {
  for (let attempt = 0; attempt < 10; attempt++) {
    const { messages } = await fetch(
      `${MAIL_API}/search?query=${encodeURIComponent(`to:"${email}"`)}`,
    ).then((response) => response.json());

    if (messages.length) {
      const { HTML } = await fetch(
        `${MAIL_API}/message/${messages[0].ID}`,
      ).then((response) => response.json());

      const [, id, token] =
        /verify\?id=([^&"'\s<]+)&(?:amp;)?token=([^&"'\s<]+)/.exec(HTML) ?? [];
      if (!id || !token) break;

      const { status } = await request(
        "GET",
        `/account/verify?id=${id}&token=${token}`,
      );
      if (status !== 200) break;

      ok(`${username}: email verified`);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  fail(`${username}: email could not be verified`);
};

const login = async (user: User, retry = true): Promise<Session> => {
  const { username, email, password } = user;
  const { status, data, message } = await request<{
    accountId: string;
    token: string;
  }>("POST", "/account/login", { body: { email, password } });

  if (retry && message === "Your email is not verified!") {
    await verifyEmail(user);
    return login(user, false);
  }

  if (status !== 200 || !data) {
    return fail(`${username}: login failed (${status} ${message ?? ""})`);
  }

  return {
    "account-id": data.accountId,
    token: data.token,
  };
};

const setAdmin = async (user: User, session: Session) => {
  const { status } = await request("POST", "/admin", { headers: session });

  if (status === 200) ok(`${user.username}: is now admin`);
  else ok(`auth already has an admin`);
};

type Hotel = {
  hotelId: string;
  name: string;
  integrations: { integrationId: string; name: string }[];
};

const getHotel = async (name: string, session: Session): Promise<Hotel> => {
  const findHotel = async () => {
    const { data } = await request<{ hotels: Hotel[] }>(
      "GET",
      "/user/@me/hotel",
      { headers: session },
    );

    return data?.hotels.find((hotel) => hotel.name === name);
  };

  const hotel = await findHotel();
  if (hotel) {
    ok(`hotel: '${name}' already exists`);
    return hotel;
  }

  const { status } = await request("POST", "/user/@me/hotel", {
    headers: session,
    body: { name, public: true },
  });

  if (status !== 200) fail(`hotel: create failed (${status})`);

  ok(`hotel: '${name}' created`);

  const createdHotel = await findHotel();
  return createdHotel!;
};

const getLicenseToken = async (
  hotel: Hotel,
  integration: Integration,
  session: Session,
): Promise<string> => {
  let integrationId = hotel.integrations.find(
    ({ name }) => name === integration.name,
  )?.integrationId;

  if (!integrationId) {
    const { status, data } = await request<{ integrationId: string }>(
      "POST",
      "/user/@me/hotel/integration",
      { headers: session, body: { hotelId: hotel.hotelId, ...integration } },
    );

    if (status !== 200 || !data) {
      fail(`${integration.type}: integration failed (${status})`);
    }

    integrationId = data!.integrationId;
  }

  const { data } = await request<{ token: string }>(
    "GET",
    `/user/@me/hotel/integration?hotelId=${hotel.hotelId}&integrationId=${integrationId}`,
    { headers: session },
  );

  if (!data?.token) {
    fail(`${integration.type}: license failed`);
  }

  ok(`${integration.type}: license generated`);
  return data!.token;
};

const regenerateToken = async (
  name: string,
  pathname: "/admin/tokens" | "/admin/apps",
  body: { label: string } | { url: string },
  session: Session,
): Promise<string> => {
  const { status, data } = await request<{
    tokens: { id: string; label?: string; url?: string }[];
  }>("GET", pathname, { headers: session });

  if (status !== 200) {
    fail(`${name}: listing tokens failed (${status}), not admin?`);
  }

  const [key, value] = Object.entries(body)[0];
  for (const token of data!.tokens) {
    if (token[key as "label" | "url"] !== value) continue;
    await request("DELETE", `${pathname}?id=${token.id}`, { headers: session });
  }

  const { data: created } = await request<{ token: string }>("POST", pathname, {
    headers: session,
    body,
  });

  if (!created?.token) fail(`${name}: token creation failed`);

  ok(`${name}: token generated`);
  return created!.token;
};

type Config = {
  auth?: Record<string, unknown>;
  onet?: Record<string, unknown>;
};

const updateConfig = async (path: string, update: (config: Config) => void) => {
  try {
    const config = await readYaml<Config>(path);
    update(config);
    await writeYaml(path, config);
    ok(`${path} updated`);
  } catch {
    warn(`${path} not found, run 'deno task setup' first`);
  }
};

const seed = await readYaml<Seed>(join(ROOT, "seed.yml"));
const reposDir = getReposDir(await loadEnv());

await checkAuth();

const sessions: Session[] = [];
for (const user of seed.users) {
  await register(user);
  const session = await login(user);
  sessions.push(session);
}

const [owner] = seed.users;
const [ownerSession] = sessions;
await setAdmin(owner, ownerSession);

const hotel = await getHotel(seed.hotel.name, ownerSession);

const clientLicense = await getLicenseToken(
  hotel,
  INTEGRATIONS.client,
  ownerSession,
);
const webLicense = await getLicenseToken(hotel, INTEGRATIONS.web, ownerSession);
const onetToken = await regenerateToken(
  "onet",
  "/admin/tokens",
  { label: ONET_TOKEN_LABEL },
  ownerSession,
);
const staticToken = await regenerateToken(
  "static",
  "/admin/apps",
  { url: STATIC_URL },
  ownerSession,
);
const assetEditorToken = await regenerateToken(
  "asset-editor",
  "/admin/apps",
  { url: ASSET_EDITOR_URL },
  ownerSession,
);
const onetServiceToken = Array.from(
  crypto.getRandomValues(new Uint8Array(32)),
  (byte) => byte.toString(16).padStart(2, "0"),
).join("");

await updateConfig(join(reposDir, "openhotel/app/server/config.yml"), (c) => {
  c.auth = { ...c.auth, enabled: true, licenseToken: clientLicense };
});
await updateConfig(join(reposDir, "onet/config.yml"), (c) => {
  c.auth = { ...c.auth, token: onetToken, serviceToken: onetServiceToken };
});
await updateConfig(join(reposDir, "auth/app/server/config.yml"), (c) => {
  c.onet = { ...c.onet, enabled: true, api: ONET_API, token: onetServiceToken };
});
await updateConfig(join(reposDir, "web/app/server/config.yml"), (c) => {
  c.auth = { ...c.auth, enabled: true, licenseToken: webLicense };
});
await updateConfig(join(reposDir, "static/app/server/config.yml"), (c) => {
  c.auth = { ...c.auth, enabled: true, appToken: staticToken };
});
await updateConfig(
  join(reposDir, "asset-editor/app/server/config.yml"),
  (c) => {
    c.auth = { ...c.auth, enabled: true, appToken: assetEditorToken };
  },
);

console.log(`
Ready! Restart the services to use the new tokens:

Users (password):
${seed.users.map(({ email, password }) => `  - ${email} (${password})`).join("\n")}
`);
