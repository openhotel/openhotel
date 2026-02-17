import { useContext } from "react";
import { ModerationContext, ModerationState } from "./moderation.context";

export const useModeration = (): ModerationState =>
  useContext(ModerationContext);
