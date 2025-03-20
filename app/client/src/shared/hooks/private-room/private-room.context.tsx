import React from "react";
import { Point3d, PrivateRoom, User } from "shared/types";
import { Direction } from "shared/enums";

export type TemplateState = {
  users: User[];
  room: PrivateRoom;

  addUser: (user: User) => void;
  removeUser: (accountId: string) => void;
  setUserPosition: (
    accountId: string,
    position: Point3d,
    bodyDirection?: Direction,
  ) => void;
};

export const PrivateRoomContext = React.createContext<TemplateState>(undefined);
