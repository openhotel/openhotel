import { ProxyEvent, UserAction } from "shared/enums/main.ts";
import { Furniture } from "shared/types/furniture.types.ts";
import { Contract } from "./company.types.ts";
import { Point, Point3d } from "@shared/types/point.types.ts";
import { CrossDirection, Direction } from "@shared/enums/direction.enums.ts";
import { Hemisphere } from "@shared/enums/hemisphere.enums.ts";
import { Transaction } from "@shared/types/economy.types.ts";

export type CacheUser = {
  accountId: string;
  username: string;
};

export type PrivateUser = {
  accountId: string;
  username: string;

  clientId: string;
  languages?: string[];

  apiToken: string;

  hemisphere: Hemisphere;

  admin?: boolean;

  auth: {
    connectionToken: string;
  };

  ip: string;
};

//@ignore-duplicate
export type User = {
  accountId: string;
  username: string;

  roomId?: string;

  gameClientId?: string;
  gameId?: string | null;

  position?: Point3d;
  positionUpdatedAt?: number;

  bodyDirection?: Direction;

  meta?: (string | number)[];
};

export type PublicUser = {
  accountId: string;
  username: string;

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

  getClientId: () => string;
  getIp: () => string;

  setPosition: (position: Pick<Point3d, "x" | "z">) => void;
  getPosition: () => Point3d | null;
  getPositionUpdatedAt: () => number | null;

  setBodyDirection: (direction: Direction) => void;
  getBodyDirection: () => Direction;

  setRoom: (roomId: string) => void;
  getRoom: () => string | null;
  removeRoom: () => void;

  setAction: (action: UserAction | null) => void;
  getAction: () => UserAction | null;

  preMoveToRoom: (roomId: string) => Promise<void>;
  moveToRoom: (roomId: string) => Promise<void>;

  setTargetPosition: (position: Point3d) => Promise<void>;

  getPathfinding: () => Point3d[];

  setLastMessage: (message: string | null) => void;
  getLastMessage: () => string | null;

  setLastWhisper: (user: UserMutable | null) => void;
  getLastWhisper: () => UserMutable | null;

  getObject: () => User;
  getPublicObject: () => PublicUser;

  getMeta: () => (number | string)[] | null;

  isOp: () => Promise<boolean>;

  disconnect: () => void;

  emit: <Data extends any>(event: ProxyEvent, data?: Data) => void;

  log: (...data: string[]) => Promise<void>;

  getCredits: () => Promise<number>;
  getTransactions: () => Promise<Transaction[]>;
  getContracts: () => Promise<Contract[]>;

  addFurniture: (furnitureId: string, id: string) => Promise<void>;
  removeFurniture: (id: string) => Promise<void>;
  getFurniture: (id: string) => Promise<Furniture | null>;
  getInventory: () => Promise<Furniture[]>;

  moveFurnitureFromInventoryToRoom: (
    id: string,
    position: Point3d,
    direction?: CrossDirection,
    wallPosition?: Point,
  ) => Promise<boolean>;

  moveFurnitureFromRoomToInventory: (id: string) => Promise<boolean>;
  moveAllFurnitureFromRoomToInventory: (roomId?: string) => Promise<boolean>;

  setColor: (color: number) => Promise<void>;
  getColor: () => Promise<number | null>;

  setGame: (gameId: string, clientId: string) => void;
  getGame: () => string | null;
  removeGame: () => void;
  getGameClientId: () => string | null;
};
