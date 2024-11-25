export type ConfigTypes = {
  name: string;
  description: string;
  version: string;
  auth: {
    enabled: boolean;
    api: string;
  };
  onet: {
    enabled: string;
  };
};
