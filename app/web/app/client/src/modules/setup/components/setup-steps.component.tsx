import React, { useCallback } from "react";
import { Step } from "shared/types/setup.types.ts";
import { useTranslation } from "react-i18next";

type Props = {
  steps: readonly Step[];
  index?: number;
  reachable?: number;
  onClickStep?: (index: number) => void;
};

export const SetupStepsComponent: React.FC<Props> = ({
  steps,
  index = 0,
  reachable = 0,
  onClickStep,
}) => {
  const { t } = useTranslation();

  const renderSteps = useCallback(
    (
      steps: readonly Step[],
      startIndex: number = 0,
      prefix: string = "",
    ): [React.ReactNode[], number] => {
      const list: React.ReactNode[] = [];
      let nextIndex = startIndex;

      steps.forEach((step, position) => {
        const number = prefix + (position + 1);
        const stepIndex = nextIndex;
        const isLeaf = !step.steps;
        const isCurrent = isLeaf && index === stepIndex;
        const isComplete = isLeaf && stepIndex < reachable;
        const isClickable = isLeaf && stepIndex <= reachable && !isCurrent;

        list.push(
          <div
            key={number}
            onClick={isClickable ? () => onClickStep?.(stepIndex) : undefined}
            className={[
              "font-bold px-3 py-2 select-none",
              prefix ? "pl-6!" : "",
              isComplete ? "setup-step-complete" : "",
              isClickable ? "cursor-pointer" : "",
              isClickable && !isComplete ? "setup-step-next" : "",
              isCurrent ? "bg-(--accent) text-(--border)" : "",
            ].join(" ")}
          >
            {number}
            {prefix ? "" : "."} {t(step.label)}
          </div>,
        );

        if (step.steps) {
          const [children, childNext] = renderSteps(
            step.steps,
            nextIndex,
            number + ".",
          );
          list.push(...children);
          nextIndex = childNext;
        } else {
          nextIndex++;
        }
      });

      return [list, nextIndex];
    },
    [index, onClickStep, reachable, t],
  );

  return (
    <div className="flex flex-col divide-y divide-dotted divide-(--line)">
      {renderSteps(steps)[0]}
    </div>
  );
};
