import { useContext } from "react";
import { RoomContext, RoomState } from "./room.context";
import { Room } from "../../types";

export const useRoom = <RoomType extends Room>(): RoomState<RoomType> =>
  useContext(RoomContext);
