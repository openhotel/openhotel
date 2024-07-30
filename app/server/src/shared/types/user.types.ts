import { Point3d } from "shared/types/point.types.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

export type PrivateUser = {
  id: string;
  username: string;
  session?: string;
  clientId?: string;
};

export type User = {
  id: string;
  username: string;

  roomId?: string;

  position?: Point3d;
  positionUpdatedAt?: number;
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
  getId: () => string;
  getUsername: () => string;

  setPosition: (position: Point3d) => void;
  getPosition: () => Point3d | null;
  getPositionUpdatedAt: () => number | null;

  setRoom: (roomId: string) => void;
  getRoom: () => string | null;
  removeRoom: () => void;

  setPathfinding: (path: Point3d[]) => void;
  getPathfinding: () => Point3d[];

  getObject: () => User;

  disconnect: () => void;

  emit: <Data extends any>(event: ProxyEvent, data?: Data) => void;
};
