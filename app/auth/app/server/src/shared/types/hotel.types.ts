import { DbHotelIntegrationType } from "shared/enums/hotel.enums.ts";
import { AccountMutable } from "shared/types/account.types.ts";

export type DbHotel = {
  accountId: string;
  hotelId: string;
  name: string;
  public: boolean;

  integrations: DbHotelIntegration[];

  createdAt: number;
  updatedAt: number;

  official: boolean;
  verified: boolean;

  blocked: boolean;
};

export type DbHotelIntegration = {
  integrationId: string;
  name: string;
  redirectUrl: string;
  type: DbHotelIntegrationType;
  createdAt: number;
  updatedAt: number;
  // hotel: number;
  // accounts: string[];
};

export type HotelCreation = {
  name: string;
  public: boolean;
  accountId: string;
};

//

export type HotelMutable = {
  getLicenseData: () => Promise<HotelIntegrationLicenseData | null>;

  getIntegrations: () => HotelIntegrationMutable[];
  getIntegration: (
    data: HotelIntegrationMutableGet,
  ) => HotelIntegrationMutable | null;

  getOwner: () => Promise<AccountMutable>;

  getAccounts: () => Promise<AccountMutable[]>;

  update: (hotel: Partial<DbHotel>) => Promise<void>;
  getObject: () => DbHotel;
  remove: () => Promise<void>;

  integrations: HotelIntegrationsMutable;
};

export type HotelMutableGet = {
  hotelId?: string;
  licenseToken?: string;
  request?: Request;
};

export type HotelListMutableGet = {
  accountId?: string;
};

export type HotelIntegrationLicenseData = {
  hotelId: string;
  accountId: string;
  integrationId: string;
};

export type HotelIntegrationMutableGet = {
  integrationId?: string;
  type?: DbHotelIntegrationType;
};

export type HotelIntegrationMutable = {
  generateLicense: () => Promise<string>;

  addAccount: (accountId: string, scopes: string[]) => Promise<void>;
  removeAccount: (accountId: string) => Promise<void>;
  getAccounts: () => Promise<AccountMutable[]>;

  getObject: () => DbHotelIntegration;
  remove: () => Promise<void>;

  getHotel: () => Promise<HotelMutable>;
};

export type HotelIntegrationsMutable = {
  getIntegration: (integrationId: string) => HotelIntegrationMutable;
  addIntegration: (
    integration: HotelIntegrationCreation,
  ) => Promise<string | null>;
};

export type HotelIntegrationCreation = {
  name: string;
  redirectUrl: string;
  type: DbHotelIntegrationType;
};
