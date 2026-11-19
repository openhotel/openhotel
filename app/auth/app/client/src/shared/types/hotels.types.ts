import { DbHotelIntegrationType } from "@shared/enums/hotel.enums.ts";

// @ignore-duplicate
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
  type: DbHotelIntegrationType;
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
  type: DbHotelIntegrationType;
  connections: PrivateHotelIntegrationConnection[];
};

export type PrivateHotel = {
  integrations: PrivateHotelIntegration[];
} & Exclude<Hotel, "integrations">;
