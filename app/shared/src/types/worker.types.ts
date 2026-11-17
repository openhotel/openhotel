export type WorkerParentProps = {
  url: string;
  pingInterval: number;
  pingTimeout: number;
};

type Worker<Event = string> = {
  on: (
    event: Event | string,
    callback: (event: string, message: any) => void,
  ) => number;
  emit: (event: string, message: any) => void;
  remove: (event: string, id: number) => void;
  close: () => void;
};

export type WorkerChild = Worker;
export type WorkerParent = Worker<"disconnected">;
