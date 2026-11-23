import { LeafStep, Step } from "shared/types/setup.types.ts";

export const getLeafSteps = (
  steps: readonly Step[],
  prefix: string = "",
): LeafStep[] =>
  steps.flatMap((step) => {
    const path = prefix + step.key;
    return step.steps ? getLeafSteps(step.steps, path + "/") : [{ step, path }];
  });

export const getVisibleSteps = (
  steps: readonly Step[],
  data: unknown,
): Step[] =>
  steps
    .filter((step) => step.when?.(data) ?? true)
    .map((step) =>
      step.steps ? { ...step, steps: getVisibleSteps(step.steps, data) } : step,
    );

export const getReachableIndex = (
  leafSteps: LeafStep[],
  data: Record<string, unknown>,
): number => {
  const firstIncomplete = leafSteps.findIndex(
    ({ step }) => !step.schema?.safeParse(data[step.key]).success,
  );
  return firstIncomplete === -1 ? leafSteps.length - 1 : firstIncomplete;
};
