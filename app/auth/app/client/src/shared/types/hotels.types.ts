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
  type: "client" | "web";
  hotel: number;
  accounts: number;
};
