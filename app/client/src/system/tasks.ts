import { queue, windowTicker, QueueItemProps } from "@oh/queue";

export const tasks = () => {
  const $ticker = windowTicker();
  const $queue = queue({
    onPause: $ticker.pause,
    onResume: $ticker.start,
  });

  const load = () => {
    $ticker.onTick(({ delta }) => $queue.tick(delta));
  };

  const add: (props: QueueItemProps) => number = $queue.add;
  const remove: (id: number) => void = $queue.remove;

  return {
    load,

    add,
    remove,
  };
};
