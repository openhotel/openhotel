import { WorkerParent, WorkerParentProps } from "../../types/worker.types.ts";

export const getParentWorker = ({
  url,
  pingTimeout = 1_000,
  pingInterval = 100,
}: WorkerParentProps): WorkerParent => {
  const events: Record<string, any[]> = {};

  const worker = new Worker(url, { type: "module" });

  worker.onmessage = ({ data: { event, message } }) => {
    const eventList = (events[event] || []).filter(Boolean);
    if (eventList) {
      for (const event of eventList) {
        event(message);
      }
    }
  };

  const on = (
    event: "disconnected" | string,
    callback: (event: string, message: any) => void,
  ) => {
    if (!events[event]) events[event] = [];
    return events[event].push(callback) - 1;
  };

  const emit = (event: string, message: any) =>
    worker.postMessage({ event, message });

  const remove = (event: string, id: number) =>
    (events[event] = events[event].filter((event, index) =>
      index === id ? undefined : event,
    ));

  const close = () => worker.terminate();

  // ping child to know is alive, if not, disconnect
  let lastTimeout: number | undefined;
  let lastPingTimeout: number | undefined;
  on("__internal__pong", () => {
    lastPingTimeout = setTimeout(() => {
      emit("__internal__ping", {});
    }, pingInterval);
    clearTimeout(lastTimeout);
    lastTimeout = setTimeout(() => {
      if (events.disconnected) {
        for (const event of events.disconnected) {
          event();
        }
      }
      clearTimeout(lastPingTimeout);
    }, pingTimeout);
  });

  return {
    on,
    emit,
    remove,
    close,
  };
};
