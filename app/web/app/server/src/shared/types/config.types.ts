export type ConfigTypes = {
  port: number;
  version: string;
  development: boolean;
  database: {
    filename: string;
  };
  auth: {
    url: string;
  };
  client: {
    url: string;
  };
};
