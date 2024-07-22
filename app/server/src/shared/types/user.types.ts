export type User = {
  id: string;
  username: string;
  session?: string;
  clientId?: string;
};

export type UsersConfig = {
  op: {
    users: string[];
  };
  whitelist: {
    active: boolean;
    users: string[];
  };
  blacklist: {
    active: boolean;
    users: string[];
  };
};
