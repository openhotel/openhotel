export type Connection = {
  hotelId: string;
  name: string;
  owner: string;
  verified: boolean;
  connections: ConnectionIntegration[];
};

export type ConnectionIntegration = {
  active: boolean;
  integrationId: string;
  name: string;
  redirectUrl: string;
  scopes: string[];
  type: "web" | "client";
};

export type FullConnection = {
  hotelId: string;
  hotelName: string;
  owner: string;
  verified: boolean;
} & ConnectionIntegration;

export type PartialConnection = {
  hotelId: string;
  name: string;
  owner: string;
  redirectUrl: string;
  verified: boolean;
  accounts: number;
  type: "web" | "client";
};
