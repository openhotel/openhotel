import { WorkerChild } from "../../types/worker.types.ts";

export const getChildWorker = (): WorkerChild => {
  const events: Record<string, any[]> = {};

  //@ts-ignore
  self.onmessage = ({ data: { event, message } }: any) => {
    const eventList = (events[event] || []).filter(Boolean);
    if (eventList) {
      for (const event of eventList) {
        event(message);
      }
    }
  };

  const on = (
    event: string,
    callback: (event: string, message: any) => void,
  ) => {
    if (!events[event]) events[event] = [];
    return events[event].push(callback) - 1;
  };

  const emit = (event: string, message: any) =>
    //@ts-ignore
    self.postMessage({ event, message });

  const remove = (event: string, id: number) =>
    (events[event] = events[event].filter((event, index) =>
      index === id ? undefined : event,
    ));

  const close = () => self.close();

  emit("__internal__pong", {});
  on("__internal__ping", () => emit("__internal__pong", {}));

  return {
    on,
    emit,
    remove,
    close,
  };
};
