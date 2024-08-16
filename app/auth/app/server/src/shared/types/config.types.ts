export type ConfigTypes = {
  port: number;
  url: string;
  database: {
    filename: string;
  };
  captcha: {
    enabled: boolean;
    url: string;
    id: string;
    token: string;
  };
  email: {
    hostname: string;
    port: number;
    username: string;
    password: string;
  };
};
