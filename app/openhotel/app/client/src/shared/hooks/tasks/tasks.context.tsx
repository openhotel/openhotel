import React from "react";
import { QueueItemProps } from "@shared/modules/old/queue/queue.types.ts";

export type TasksState = {
  add: (props: QueueItemProps) => () => void;
};

export const TasksContext = React.createContext<TasksState>(undefined);
