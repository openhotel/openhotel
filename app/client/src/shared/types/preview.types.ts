import { User } from "shared/types/user.types";
import { RoomFurniture } from "shared/types/furniture.types";

export type PreviewAction = {
  name: string;
  icon?: unknown;
  action: () => void;
};

export type PreviewTypes = "furniture" | "human";

export type Preview = {
  type: PreviewTypes;
  user?: User;
  furniture?: RoomFurniture;
};
