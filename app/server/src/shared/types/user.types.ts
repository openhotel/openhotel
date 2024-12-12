import { Point3d, Direction } from "@oh/utils";
import { ProxyEvent, Language, Hemisphere } from "shared/enums/main.ts";

export type CacheUser = {
  accountId: string;
  username: string;
};

export type PrivateUser = {
  accountId: string;
  username: string;

  clientId: string;
  language?: Language;

  apiToken: string;

  hemisphere: Hemisphere;

  auth: {
    connectionToken: string;
  };

  ip: string;
};

export type User = {
  accountId: string;
  username: string;

  roomId?: string;

  position?: Point3d;
  positionUpdatedAt?: number;

  bodyDirection?: Direction;

  meta?: (string | number)[];
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

export type UserMutable = {
  getAccountId: () => string;
  getUsername: () => string;

  setPosition: (position: Pick<Point3d, "x" | "z">) => void;
  getPosition: () => Point3d | null;
  getPositionUpdatedAt: () => number | null;

  setBodyDirection: (direction: Direction) => void;
  getBodyDirection: () => Direction;

  setRoom: (roomId: string) => void;
  getRoom: () => string | null;
  removeRoom: () => void;

  moveToRoom: (roomId: string) => Promise<void>;

  setTargetPosition: (position: Point3d) => Promise<void>;

  getPathfinding: () => Point3d[];

  setLastMessage: (message: string) => void;
  getLastMessage: () => string;

  getObject: () => User;

  setLanguage: (language: Language) => void;
  getLanguage: () => Language;

  getMeta: () => (number | string)[] | null;

  isOp: () => Promise<boolean>;

  disconnect: () => void;

  emit: <Data extends any>(event: ProxyEvent, data?: Data) => void;
};
