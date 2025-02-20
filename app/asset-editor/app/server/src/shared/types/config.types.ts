export type ConfigTypes = {
  port: number;
  url: string;
  version: string;
  auth: {
    enabled: boolean;
    url: string;
    appToken: string;
  };
};
