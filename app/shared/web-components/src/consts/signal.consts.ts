import { Signal } from "../enums";

export const SIGNAL_MAP: Record<Signal, number> = {
  [Signal.NONE]: 500,
  [Signal.LOW]: 160,
  [Signal.MEDIUM]: 120,
  [Signal.HIGH]: 60,
  [Signal.FULL]: 0,
};
