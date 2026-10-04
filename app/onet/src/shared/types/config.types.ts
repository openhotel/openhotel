export type ConfigTypes = {
  version: string;
  port: number;
  auth: {
    api: string;
    token: string;
  };
  collections: {
    s3: {
      enabled: boolean;
      accessKey: string;
      secretKey: string;
      endpoint: string;
      region: string;
      bucket: string;
      port: number;
      useSSL: boolean;
    };
  };
};
