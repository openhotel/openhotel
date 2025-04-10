import { useContext } from "react";
import {
  PrivateRoomContext,
  PrivateRoomState,
} from "shared/hooks/private-room/private-room.context";

export const usePrivateRoom = (): PrivateRoomState =>
  useContext(PrivateRoomContext);
