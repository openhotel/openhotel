import { rooms } from "./rooms";

export const game = () => {
  return {
    rooms: rooms(),
  };
};
