import { ticker } from "@shared/modules/old/queue/ticker.ts";
import { queue } from "@shared/modules/old/queue/queue.ts";
import { QueueItemProps } from "@shared/modules/old/queue/queue.types.ts";

export const tasks = () => {
  const $ticker = ticker();
  const $queue = queue();

  const load = () => {
    $ticker.onTick(({ delta }) => $queue.tick(delta));
    $ticker.load({ ticks: 20 });
    $ticker.start();
  };

  const add: (props: QueueItemProps) => number = $queue.add;
  const remove: (id: number) => void = $queue.remove;
  const pause = () => $ticker.pause();

  return {
    load,

    add,
    remove,
    pause,
  };
};
