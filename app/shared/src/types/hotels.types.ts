import { DbHotelIntegrationType } from "@shared/enums/hotel.enums.ts";

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
