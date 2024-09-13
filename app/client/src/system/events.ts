import { SystemEvent } from "shared/enums";

export const events = () => {
  let eventFunctionMap: Record<SystemEvent | string | number, Function[]> = {};

  const emit = <Data>(event: SystemEvent | string, data?: Data) => {
    for (const callback of eventFunctionMap[event]?.filter(Boolean) ?? [])
      callback(data ?? {});
  };

  const on = (
    event: SystemEvent | string,
    callback: (data?: any) => void | Promise<void>,
  ): (() => void) => {
    if (!eventFunctionMap[event]) eventFunctionMap[event] = [];

    const callbackId = eventFunctionMap[event].push(callback) - 1;
    return () => {
      eventFunctionMap[event] = eventFunctionMap[event].map(
        (callback, $callbackId) =>
          callbackId === $callbackId ? undefined : callback,
      );
    };
  };

  return {
    emit,
    on,
  };
};
