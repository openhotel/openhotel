import { Point3d } from "shared/types/point.types.ts";
import { ProxyEvent, Direction, Language } from "shared/enums/main.ts";

export type PrivateUser = {
  accountId: string;
  username: string;

  clientId: string;
  language?: Language;

  apiToken: string;
};

export type User = {
  accountId: string;
  username: string;

  roomId?: string;

  position?: Point3d;
  positionUpdatedAt?: number;

  bodyDirection?: Direction;
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

  setPathfinding: (path: Point3d[]) => void;
  getPathfinding: () => Point3d[];

  setLastMessage: (message: string) => void;
  getLastMessage: () => string;

  getObject: () => User;

  setLanguage: (language: Language) => void;
  getLanguage: () => Language;

  disconnect: () => void;

  emit: <Data extends any>(event: ProxyEvent, data?: Data) => void;
};
