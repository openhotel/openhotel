import { Signal } from "../enums";
import { SIGNAL_MAP } from "../consts";

export const getSignal = (ms?: number): Signal => {
  if (isNaN(ms) || 0 > ms || ms > SIGNAL_MAP[Signal.NONE]) return Signal.NONE;
  if (ms > SIGNAL_MAP[Signal.LOW]) return Signal.LOW;
  if (ms > SIGNAL_MAP[Signal.MEDIUM]) return Signal.MEDIUM;
  if (ms > SIGNAL_MAP[Signal.HIGH]) return Signal.HIGH;
  return Signal.FULL;
};
