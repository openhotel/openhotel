export type ConfigTypes = {
  port: number;
  url: string;
  version: string;
  auth: {
    enabled: boolean;
    url: string;
    appToken: string;
  };
  database: {
    filename: string;
    backupName: string;
  };
  s3: {
    enabled: boolean;
    accessKey: string;
    secretKey: string;
    endpoint: string;
    region: string;
    bucket: string;
  };
};
