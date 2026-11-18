import { TickerQueue } from "@shared/modules/old/queue/ticker-queue.enum.ts";

export type Milliseconds = number;

export type QueueItemProps =
  CustomItemQueue | RepeatItemQueue | DelayItemQueue | DurationItemQueue;

export type BaseItemQueue = {
  id?: number;
  accDelta?: number;
  onFunc?: (delta: number) => void | boolean | Promise<void | boolean>;
  onDone?: () => void | Promise<void>;
};

export type CustomItemQueue = {
  type: TickerQueue.CUSTOM;
} & BaseItemQueue;

export type DelayItemQueue = {
  type: TickerQueue.DELAY;
  delay: Milliseconds;
} & BaseItemQueue;

export type DurationItemQueue = {
  type: TickerQueue.DURATION;
  duration: Milliseconds;
} & BaseItemQueue;

export type RepeatItemQueue = {
  type: TickerQueue.REPEAT;
  repeatEvery: Milliseconds;
  repeats: number;
} & BaseItemQueue;

export type QueueProps = {
  onResume?: () => void;
  onPause?: () => void;
};

export type QueueMutable = {
  add: (props: QueueItemProps) => number;
  addAsync: (props: QueueItemProps) => Promise<number>;
  remove: (id: number) => void;

  tick: (delta: number) => void;
};
