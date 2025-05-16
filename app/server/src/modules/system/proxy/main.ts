import { WorkerParent } from "worker_ionic";
import { PrivateUser, WorkerProps } from "shared/types/main.ts";
import { loadInternalEvents, eventList } from "./events/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { log } from "shared/utils/main.ts";
import { System } from "modules/system/main.ts";
import { requestList } from "./api/main.ts";
import { getParentWorker } from "worker_ionic";
import { RequestMethod } from "@oh/utils";

type WorkerDataProps = {
  user: PrivateUser;
  event: ProxyEvent;
  message: any;
};

type WorkerApiProps = {
  user: PrivateUser;
  data: Record<string, string>;
  eventName: string;
  method: RequestMethod;
  url: string;
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

  const load = () => {
    const config = System.config.get();
    const envs = System.getEnvs();

    $worker = getParentWorker({
      url: new URL("../../proxy/main.ts", import.meta.url).href,
    });
    $worker.emit("start", {
      config,
      envs,
    } as WorkerProps);

    loadInternalEvents($worker);

    $worker.on(
      ProxyEvent.$USER_DATA,
      ({ user, event, message }: WorkerDataProps) => {
        try {
          const foundEvent = eventList.find(
            (proxyEvent) => proxyEvent.event === (event as unknown),
          );
          if (!foundEvent) return;

          foundEvent.func({
            user: System.game.users.get({ accountId: user.accountId }),
            data: message,
          });
        } catch (e) {
          log(e);
        }
      },
    );

    $worker.on(
      ProxyEvent.$USER_API_DATA,
      async ({ eventName, data, user, method, url }: WorkerApiProps) => {
        try {
          const parsedUrl = new URL(url);
          const foundRequests = requestList.filter(
            ($request) =>
              $request?.pathname === parsedUrl.pathname ||
              $request?.match?.test?.(parsedUrl.pathname),
          );
          const foundMethodRequest = foundRequests.find(
            ($request) => $request.method === method,
          );

          if (!foundMethodRequest)
            return $worker.emit(eventName, { status: 404 });

          if (
            foundMethodRequest.token &&
            !System.isTokenValid(parsedUrl.searchParams.get("token"))
          )
            return $worker.emit(eventName, {
              status: 403,
            });

          if (!foundMethodRequest.token && !foundMethodRequest.public && !user)
            return $worker.emit(eventName, {
              status: 403,
            });

          const response = await foundMethodRequest.func(
            {
              user: user
                ? System.game.users.get({ accountId: user.accountId })
                : null,
              data,
            },
            parsedUrl,
          );

          $worker.emit(eventName, response);
        } catch (e) {
          log(e);
        }
      },
    );
  };

  const $emit = <Data = any>(event: ProxyEvent, data: Data = {} as Data) =>
    $worker.emit(event, data);

  const emit = <Data = any>({ users, event, data }: EmitProps<Data>) => {
    $emit(ProxyEvent.$USER_DATA, {
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
