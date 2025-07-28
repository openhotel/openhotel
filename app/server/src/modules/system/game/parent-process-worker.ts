import type { WorkerParent } from "../../types/worker.types.ts";
import { TextLineStream } from "@std/streams";

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

  const reader = child.stdout
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  (async () => {
    for await (const line of reader) {
      try {
        const match = new RegExp(/§(\{.*?\})§/).exec(line);
        if (!match) {
          Deno.stdout.writeSync(encoder.encode(line + "\n"));
          continue;
        }
        const { event, message } = JSON.parse(match?.[1]);

        const eventList = (events[event] || []).filter(
          (event) => event !== null,
        );
        for (const event of eventList) event(message);
      } catch (e) {}
    }
    await child.status;
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
      index === id ? null : event,
    ));

  const close = () => child.kill();

  return {
    on,
    emit,
    remove,
    close,
  };
};
