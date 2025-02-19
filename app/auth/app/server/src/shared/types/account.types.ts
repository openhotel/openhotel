import {
  HotelCreation,
  HotelMutable,
  HotelMutableGet,
} from "shared/types/hotel.types.ts";
import { Scope } from "shared/enums/scopes.enums.ts";

export type DbAccount = {
  accountId: string;
  username: string;

  emailHash: string;
  passwordHash: string;

  languages: string[];

  verified: boolean;

  createdAt: number;
  updatedAt: number;

  githubLogin?: string;
};

export type DbAccountIntegrationConnection = {
  accountId: string;

  hotelId: string;
  integrationId: string;

  name: string;

  scopes: Scope[];

  createdAt: number;
  updatedAt: number;
};

export type AccountUpdate = Partial<
  Omit<DbAccount, "emailHash" | "passwordHash"> & {
    email: string;
    password: string;
  }
>;

export type PublicAccount = {
  accountId: string;
  username: string;
  email: string;
  admin: boolean;
  otp: boolean;
  createdAt: number;
  updatedAt: number;
  verified: boolean;
  languages: string[];
  githubLogin?: string;
};

export type AccountCreation = {
  email: string;
  username: string;
  password: string;
  languages: string[];
};

export type AccountMutableGet = {
  username?: string;
  accountId?: string;
  email?: string;
  recoverToken?: string;
  //
  verifyId?: string;
  verifyToken?: string;
  //
  connectionId?: string;
  //
  request?: Request;
};

export type AccountMutable = {
  checkPassword: (password: string) => Promise<boolean>;

  createTokens: (request: Request) => Promise<{
    token: string;
    refreshToken: string;
    durations: [number, number];
  }>;
  removeTokens: () => Promise<void>;
  removeToken: (token: string) => Promise<void>;
  getTokens: () => Promise<AccountToken[]>;

  checkToken: (request: Request) => Promise<boolean>;
  checkRefreshToken: (request: Request) => Promise<boolean>;

  sendVerificationEmail: () => Promise<void>;
  verify: () => Promise<void>;

  getEmail: () => Promise<string>;

  addThirdPartyApp: (tokenId: string) => Promise<string | null>;

  isAdmin: () => Promise<boolean>;
  setAdmin: (admin: boolean) => Promise<void>;

  getHotels: () => Promise<HotelMutable[]>;
  getHotel: (data: HotelMutableGet) => Promise<HotelMutable | null>;
  createHotel: (
    hotel: Omit<HotelCreation, "accountId">,
  ) => Promise<string | null>;

  getObject: () => DbAccount;
  getPublicObject: () => Promise<PublicAccount>;

  update: (account: AccountUpdate) => Promise<void>;
  remove: () => Promise<void>;

  otp: AccountOtpMutable;
  github: AccountGithubMutable;
  hotels: AccountHotelsMutable;
  connections: AccountConnections;
};

export type AccountOtpMutable = {
  create: () => Promise<string>;
  check: (token: string, current?: boolean) => Promise<boolean>;
  verify: () => Promise<void>;
  isVerified: () => Promise<boolean>;
  remove: () => Promise<void>;
};

export type AccountGithubMutable = {
  generateUri: () => Promise<string>;
  checkState: (state: string) => Promise<boolean>;
  link: (code: string) => Promise<string | null>;
  unlink: () => Promise<void>;
};

export type AccountHotelsMutable = {
  create: (data: Omit<HotelCreation, "accountId">) => Promise<string | null>;
  getList: () => Promise<HotelMutable[]>;

  removeIntegration: (hotelId: string, integrationId: string) => Promise<void>;
};

export type AccountConnection = {
  hotelId: string;
  integrationId: string;

  scopes: Scope[];

  state: string;

  request: Request;
};

export type DbAccountActiveIntegrationConnection = {
  connectionId: string;

  hotelId: string;
  integrationId: string;

  accountId: string;
  userAgent: string;
  ip: string;

  scopes: Scope[];

  tokenHash: string;
};

export type AccountConnections = {
  // getConnection: () => Promise<Connection>;
  getConnections: () => Promise<DbAccountIntegrationConnection[]>;
  getConnection: (
    hotelId: string,
    integrationId: string,
  ) => Promise<DbAccountIntegrationConnection | null>;

  remove: (hotelId: string, integrationId: string) => Promise<void>;
  removeAll: () => Promise<void>;

  active: AccountActiveConnection;
};

export type AccountActiveConnection = {
  create: (data: AccountConnection) => Promise<string | null>;
  get: () => Promise<DbAccountActiveIntegrationConnection | null>;
  remove: () => Promise<void>;

  check: (hotelId: string, integrationId: string) => Promise<boolean>;
  checkScopes: (scopes: Scope[]) => Promise<boolean>;

  ping: (
    connectionId: string,
    request: Request,
  ) => Promise<{ estimatedNextPingIn: number } | null>;
};

export type AccountToken = {
  tokenId: string;
  os: string;
  browser: string;
  ip: string;
  updatedAt: number;
};
