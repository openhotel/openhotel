import React from "react";
import { QueueItemProps } from "@oh/queue";

export type TasksState = {
  add: (props: QueueItemProps) => () => void;
};

export const TasksContext = React.createContext<TasksState>(undefined);
