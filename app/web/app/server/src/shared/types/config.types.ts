export type ConfigTypes = {
  port: number;
  url: string;
  version: string;
  backups: {
    cron: string;
    pathname: string;
    max: number;
    password: string;
    s3: {
      enabled: boolean;
      accessKey: string;
      secretKey: string;
      endpoint: string;
      region: string;
      bucket: string;
    };
  };
  database: {
    filename: string;
  };
  auth: {
    enabled: boolean;
    appToken: string;
    url: string;
  };
};
