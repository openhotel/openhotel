export type TickerConfig = {
  ticks?: number;
};

export type TickData = {
  delta: number;
  ms: number;
  usage: number | null;
  tickCount: number;
};
export type WindowTickData = {
  fps: number;
} & Pick<TickData, "delta" | "tickCount">;

export type OnTickFunction = (data: TickData) => void;
export type OnWindowTickFunction = (data: WindowTickData) => void;

export type TickerMutable = {
  load: (config?: TickerConfig) => void;
  start: () => void;
  pause: () => void;
  onTick: (onTickCallback: OnTickFunction) => void;
  getTicks: () => number | null;
};
export type WindowTickerMutable = {
  start: () => void;
  pause: () => void;
  onTick: (onTickCallback: OnWindowTickFunction) => void;
  getFPS: () => number;
};
