export type IntegrationRedirect = {
  type: "integration";
  hotelId: string;
  integrationId: string;
};

export type AppRedirect = {
  type: "app";
  appId: string;
};

export type RedirectType = IntegrationRedirect | AppRedirect;
