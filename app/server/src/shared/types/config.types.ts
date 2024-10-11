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
    redirectUrl: string;
    api: string;
    //client emit ping checks to auth
    pingCheck: boolean;
    //server accepts user disconnected events from auth.api
    userDisconnectedEvent: boolean;
  };
  onet: {
    enabled: boolean;
  };
};
