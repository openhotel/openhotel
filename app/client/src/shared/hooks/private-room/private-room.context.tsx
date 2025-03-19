import React from "react";
import { PrivateRoom, User } from "shared/types";

export type TemplateState = {
  users: User[];
  room: PrivateRoom;
};

export const PrivateRoomContext = React.createContext<TemplateState>(undefined);
