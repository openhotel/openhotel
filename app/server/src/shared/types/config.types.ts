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
    api: string;
  };
  onet: {
    enabled: boolean;
    api: string;
  };
  phantom: {
    enabled: boolean;
    browser: {
      name: string;
      buildId: string;
    };
  };
};
