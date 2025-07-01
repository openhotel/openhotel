import type { WorkerChild } from "../../types/worker.types.ts";

export const getChildProcessWorker = (): WorkerChild => {
  const events: Record<string, any[]> = {};

  const reader = Deno.stdin.readable.pipeThrough(new TextDecoderStream());
  const encoder = new TextEncoder();

  (async () => {
    for await (const line of reader) {
      try {
        const { event, message } = JSON.parse(line);

        const eventList = (events[event] || []).filter(Boolean);
        for (const event of eventList) {
          event(message);
        }
      } catch {}
    }
  })();

  const on = (
    event: string,
    callback: (event: string, message: any) => void,
  ) => {
    if (!events[event]) events[event] = [];
    return events[event].push(callback) - 1;
  };

  const emit = (event: string, message: any) => {
    const data = "§" + JSON.stringify({ event, message }) + "§\n";
    Deno.stdout.write(encoder.encode(data));
  };

  const remove = (event: string, id: number) =>
    (events[event] = events[event].filter((event, index) =>
      index === id ? undefined : event,
    ));

  const close = () => self.close();

  return {
    on,
    emit,
    remove,
    close,
  };
};
