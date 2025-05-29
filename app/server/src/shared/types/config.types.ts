export type ConfigTypes = {
  version: string;
  name: string;
  description: string;
  port: number;
  limits: {
    players: number;
  };
  languages: string[];
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
    sleep: number;
  };
  autoupdate: {
    enabled: boolean;
    cron: string;
  };
};
