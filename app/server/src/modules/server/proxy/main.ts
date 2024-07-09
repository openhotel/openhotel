import { WorkerParent } from "worker_ionic";
import { User } from "shared/types/main.ts";
import { leftEvent, joinedEvent, eventList } from "./events/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { log } from "shared/utils/main.ts";

type WorkerProps = {
  user: User;
  event: ProxyEvent;
  message: any;
};

type EmitProps<Data> = {
  users?: string[] | string;
  event: ProxyEvent;
  data: Data;
};

type EmitRoomProps<Data> = {
  roomId: string;
  event: ProxyEvent;
  data: Data;
};

export const proxy = () => {
  let $worker: WorkerParent;

  const load = (worker: WorkerParent) => {
    $worker = worker;

    $worker.on(ProxyEvent.$JOINED, (user: User) => {
      try {
        joinedEvent.func({ user });
      } catch (e) {
        log(e);
      }
    });
    $worker.on(ProxyEvent.$LEFT, (user: User) => {
      try {
        leftEvent.func({ user });
      } catch (e) {
        log(e);
      }
    });
    $worker.on(ProxyEvent.$DATA, ({ user, event, message }: WorkerProps) => {
      try {
        const foundEvent = eventList.find(
          (proxyEvent) => proxyEvent.event === (event as unknown),
        );
        if (!foundEvent) return;

        foundEvent.func({ user, data: message });
      } catch (e) {
        log(e);
      }
    });
  };

  const $emit = <Data = any>(event: ProxyEvent, data: Data) =>
    $worker.emit(event, data);

  const emit = <Data = any>({ users, event, data }: EmitProps<Data>) => {
    $emit(ProxyEvent.$DATA, {
      users: users ? [users].flat() : ["*"],
      event,
      message: data,
    });
  };
  const emitRoom = <Data = any>({
    roomId,
    event,
    data,
  }: EmitRoomProps<Data>) => {
    $emit(ProxyEvent.$ROOM_DATA, {
      roomId,
      event,
      message: data,
    });
  };

  return {
    load,

    $emit,
    emit,
    emitRoom,
  };
};
