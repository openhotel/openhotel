import { $public } from "./public.ts";
import { $private } from "./private.ts";

export const rooms = () => {
  return {
    private: $private(),
    public: $public(),
  };
};
