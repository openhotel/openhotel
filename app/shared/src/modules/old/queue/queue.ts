import {
  QueueItemProps,
  QueueMutable,
  QueueProps,
} from "@shared/modules/old/queue/queue.types.ts";
import { TickerQueue } from "@shared/modules/old/queue/ticker-queue.enum.ts";

/**
 * @deprecated
 * @param queueProps
 */
export const queue = (queueProps: QueueProps = {}): QueueMutable => {
  let $lastId = 0;
  let $queueList: QueueItemProps[] = [];
  let $queueIdToDelete: number[] = [];
  let isActive: boolean = false;

  const $resume = () => {
    if (isActive) return;
    isActive = true;
    queueProps?.onResume?.();
  };
  const $pause = () => {
    if (!isActive) return;
    isActive = false;
    queueProps?.onPause?.();
  };

  const $queueMap: Record<
    TickerQueue,
    (props: QueueItemProps, delta: number, index: number) => boolean
  > = {
    //@ts-ignore
    [TickerQueue.DELAY]: (item: DelayItemQueue, delta: number) => {
      item.accDelta! += delta;
      const isDone = item.accDelta! >= item.delay;
      if (isDone && item.onFunc) item.onFunc(delta);
      if (isDone && item.onDone) item.onDone();
      return isDone;
    },
    //@ts-ignore
    [TickerQueue.DURATION]: (item: DurationItemQueue, delta: number) => {
      item.accDelta! += delta;
      const isDone = item.accDelta! >= item.duration;
      if (!isDone && item.onFunc) item.onFunc(delta);
      if (isDone && item.onDone) item.onDone();
      return isDone;
    },
    //@ts-ignore
    [TickerQueue.REPEAT]: (item: RepeatItemQueue, delta: number) => {
      // Repeats are 0 or below
      if (0 >= item.repeats && item.repeats !== undefined) {
        if (item.onDone) item.onDone();
        return true;
      }

      item.accDelta! += delta;

      // It's not yet time to call the func
      if (item.accDelta! < item.repeatEvery) return false;
      item.accDelta! -= item.repeatEvery;

      if (item.onFunc) item.onFunc(delta);

      if (item.repeats !== undefined) item.repeats -= 1;

      // If repeats become 0 after decrementing, call onDone
      if (item.repeats === 0) {
        if (item.onDone) item.onDone();
        return true;
      }

      return false;
    },
    //@ts-ignore
    [TickerQueue.CUSTOM]: ({ onFunc }, delta) =>
      //@ts-ignore
      onFunc && Boolean(onFunc(delta!)),
  };

  const tick = (delta: number) => {
    if (!isActive) return;

    removeQueueList();

    let index = 0;
    for (const queueItem of $queueList) {
      if (!queueItem) return;

      const isReadyToBeDeleted = $queueMap[queueItem.type](
        queueItem,
        delta,
        index,
      );
      if (isReadyToBeDeleted) $queueIdToDelete.push(queueItem.id!);

      index++;
    }

    if (!$queueList.length && !$queueIdToDelete.length) $pause();
  };

  const removeQueueList = () => {
    if (!$queueIdToDelete.length) return;
    $queueList = $queueList.filter(
      (queue) => queue && !$queueIdToDelete.includes(queue.id!),
    );
    $queueIdToDelete = [];
  };

  const getQueueId = (): number => $lastId++;

  const add = (props: QueueItemProps) => {
    const id = getQueueId();
    $queueList.push({
      ...props,
      id,
      accDelta: 0,
    });
    $resume();
    return id;
  };

  const addAsync = (queueItem: QueueItemProps): Promise<number> =>
    new Promise((resolve) => {
      const id = getQueueId();
      queueItem.onDone = () => {
        resolve(1);
      };
      $queueList.push({
        ...queueItem,
        id,
        accDelta: 0,
      });
      $resume();
      return id;
    });
  const remove = (id: number) => $queueIdToDelete.push(id);

  const addList = (list: QueueItemProps[], onDone?: () => any) => {
    const clonedList = [...list];
    if (clonedList.length === 0) return onDone && onDone();

    const object = clonedList.shift();
    if (!object) return onDone && onDone();
    add({
      ...object,
      onDone: () => {
        object.onDone && object.onDone();
        addList(clonedList, onDone);
      },
    });
  };

  return {
    add,
    addAsync,
    remove,

    tick,
  };
};
