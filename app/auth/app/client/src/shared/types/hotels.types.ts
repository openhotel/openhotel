import { HotelIntegrationType } from "shared/enums";

export type Hotel = {
  accountId: string;
  hotelId: string;
  name: string;
  public: boolean;

  integrations: HotelIntegration[];
};

export type HotelIntegration = {
  integrationId: string;
  name: string;
  redirectUrl: string;
  type: HotelIntegrationType;
  hotel: number;
  accounts: number;
};

export type PublicHotelIntegration = {
  name: string;
  url: string;
} | null;

export type PublicHotel = {
  id: string;
  name: string;
  owner: string;
  accounts: number;
  createdAt: number;
  client: PublicHotelIntegration;
  web: PublicHotelIntegration;

  official: boolean;
  verified: boolean;

  blocked: boolean;
};

export type HotelInfo = {
  name: string;
  description: string;
  version: string;
  auth: {
    enabled: boolean;
    api?: string;
  };
  onet: { enabled: boolean };
  users: number;
  maxUsers: number;
};

/**
 * -------------------------------------------------------
 * --------- PRIVATE -------------------------------------
 * -------------------------------------------------------
 */

export type PrivateHotelIntegrationConnection = {
  accountId: string;
  hotelId: string;
  integrationId: string;
  scopes: string[];
  updatedAt: number;
};

export type PrivateHotelIntegration = {
  integrationId: string;
  name: string;
  redirectUrl: string;
  type: HotelIntegrationType;
  connections: PrivateHotelIntegrationConnection[];
};

export type PrivateHotel = {
  integrations: PrivateHotelIntegration[];
} & Exclude<Hotel, "integrations">;

/**
 * -------------------------------------------------------
 * --------- DB -------------------------------------
 * -------------------------------------------------------
 */

export enum DbHotelIntegrationType {
  WEB = "web",
  CLIENT = "client",
}

export type DbHotelUser = {
  username: string;
  accountId: string;
};

export type DbHotelIntegration = {
  integrationId: string;
  name: string;
  redirectUrl: string;
  type: DbHotelIntegrationType;
  createdAt: number;
  updatedAt: number;

  accounts: DbHotelUser[];
};

export type DbHotel = {
  accountId: string;
  username: string;

  hotelId: string;
  name: string;
  public: boolean;

  accounts: DbHotelUser[];

  integrations: DbHotelIntegration[];

  createdAt: number;
  updatedAt: number;

  official: boolean;
  verified: boolean;

  blocked: boolean;
};
