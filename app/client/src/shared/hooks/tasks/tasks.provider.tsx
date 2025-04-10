import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { TasksContext } from "./tasks.context";
import { queue, QueueItemProps, ticker } from "@oh/queue";
import { QueueMutable } from "@oh/queue";

type TasksProps = {
  children: ReactNode;
};

export const TasksProvider: React.FunctionComponent<TasksProps> = ({
  children,
}) => {
  const tickerRef = useRef(ticker());
  const queueRef = useRef<QueueMutable>(null);

  const add = useCallback((props: QueueItemProps): (() => void) => {
    const index = queueRef.current.add(props);
    return () => queueRef.current.remove(index);
  }, []);

  useEffect(() => {
    queueRef.current = queue({
      onPause: tickerRef.current.pause,
      onResume: tickerRef.current.start,
    });

    tickerRef.current.onTick(({ delta }) => queueRef.current.tick(delta));

    window.addEventListener("visibilitychange", () => {
      document.hidden ? tickerRef.current.pause() : tickerRef.current.start();
    });
  }, []);

  return (
    <TasksContext.Provider
      value={{
        add,
      }}
      children={children}
    />
  );
};
