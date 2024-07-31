import { queue, ticker, QueueItemProps } from "@oh/queue";

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

  return {
    load,

    add,
    remove,
  };
};
