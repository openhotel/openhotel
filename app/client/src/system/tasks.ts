import { queue, ticker, QueueItemProps } from "@oh/queue";

export const tasks = () => {
  const $ticker = ticker();
  const $queue = queue({
    onPause: $ticker.pause,
    onResume: $ticker.start,
  });

  const load = () => {
    $ticker.onTick(({ delta }) => $queue.tick(delta));

    window.addEventListener("visibilitychange", () => {
      document.hidden ? $ticker.pause() : $ticker.start();
    });
  };

  const add: (props: QueueItemProps) => number = $queue.add;
  const remove: (id: number) => void = $queue.remove;

  return {
    load,

    add,
    remove,
  };
};
