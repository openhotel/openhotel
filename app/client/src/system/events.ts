import { SystemEvent } from "shared/enums";

export const events = () => {
  const eventFunctionMap: Record<SystemEvent | string | number, Function[]> =
    {};

  const eventOnceFunctionMap: Record<
    SystemEvent | string | number,
    Function[]
  > = {};
  const eventLastEmitMap: Record<SystemEvent | string | number, any> = {};

  const emit = <Data>(event: SystemEvent | string, data?: Data) => {
    for (const callback of eventFunctionMap[event]?.filter(Boolean) ?? [])
      callback(data ?? {});
    for (const callback of eventOnceFunctionMap[event]?.filter(Boolean) ?? []) {
      callback(data ?? {});
      eventOnceFunctionMap[event] = eventOnceFunctionMap[event].map(() => null);
    }
    eventLastEmitMap[event] = data ?? {};
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
          callbackId === $callbackId ? null : callback,
      );
    };
  };

  const once = (
    event: SystemEvent | string,
    callback: (data?: any) => void | Promise<void>,
  ): (() => void) => {
    if (!eventOnceFunctionMap[event]) eventOnceFunctionMap[event] = [];

    const callbackId = eventOnceFunctionMap[event].push(callback) - 1;
    const $onRemove = () => {
      eventOnceFunctionMap[event] = eventOnceFunctionMap[event].map(
        (callback, $callbackId) =>
          callbackId === $callbackId ? null : callback,
      );
    };

    if (eventLastEmitMap[event]) {
      callback(eventLastEmitMap[event]);
      $onRemove();
      return () => {};
    }

    return $onRemove;
  };

  return {
    emit,
    on,
    once,
  };
};
