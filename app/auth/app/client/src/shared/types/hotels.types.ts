export type Hotel = {
  accountId: string;
  hotelId: string;
  name: string;

  integrations: HotelIntegration[];
};

export type HotelIntegration = {
  integrationId: string;
  name: string;
  redirectUrl: string;
  type: "client" | "web";
  hotel: number;
  accounts: number;
};
