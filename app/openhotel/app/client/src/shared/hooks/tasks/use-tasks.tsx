import { useContext } from "react";
import { TasksContext, TasksState } from "shared/hooks/tasks/tasks.context";

export const useTasks = (): TasksState => useContext(TasksContext);
