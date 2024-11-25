export type ConfigTypes = {
  version: string;
  name: string;
  description: string;
  port: number;
  limits: {
    players: number;
  };
  auth: {
    enabled: boolean;
    licenseToken?: string;
    redirectUrl: string;
    api: string;
  };
  onet: {
    enabled: boolean;
    api: string;
  };
};
