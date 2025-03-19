import { useContext } from "react";
import {
  PrivateRoomContext,
  TemplateState,
} from "shared/hooks/private-room/private-room.context";

export const usePrivateRoom = (): TemplateState =>
  useContext(PrivateRoomContext);
