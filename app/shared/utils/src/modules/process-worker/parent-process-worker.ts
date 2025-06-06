import { WorkerParent, WorkerParentProps } from "../../types/worker.types.ts";

export const getParentProcessWorker = (
  command: string,
  args: string[],
): WorkerParent => {
  const events: Record<string, any[]> = {};

  const process = new Deno.Command(command, {
    args,
    stdin: "piped",
    stdout: "piped",
  });

  const child = process.spawn();
  const encoder = new TextEncoder();
  const writer = child.stdin.getWriter();

  const reader = child.stdout.pipeThrough(new TextDecoderStream());

  (async () => {
    for await (const line of reader) {
      try {
        if (!line.startsWith("§")) {
          console.log(line);
          continue;
        }
        const { event, message } = JSON.parse(line.substring(1));

        const eventList = (events[event] || []).filter(Boolean);
        for (const event of eventList) event(message);
      } catch {}
    }
    await child.status;

    const eventList = (events.disconnected || []).filter(Boolean);
    for (const event of eventList) event();
  })();

  const on = (
    event: "disconnected" | string,
    callback: (event: string, message: any) => void,
  ) => {
    if (!events[event]) events[event] = [];
    return events[event].push(callback) - 1;
  };

  const emit = (event: string, message: any) => {
    const data = JSON.stringify({ event, message }) + "\n";
    writer.write(encoder.encode(data));
  };

  const remove = (event: string, id: number) =>
    (events[event] = events[event].filter((event, index) =>
      index === id ? undefined : event,
    ));

  const close = () => child.kill();

  return {
    on,
    emit,
    remove,
    close,
  };
};
