import React from "react";
import { Props } from "shared/types/react.types.ts";

export const LabelComponent: React.FC<
  Props<{
    accent?: boolean;
    error?: boolean;
  }>
> = ({ accent, error, children }) => {
  return (
    <span
      className={[
        `border border-(--border) px-2 text-sm font-bold uppercase tracking-wide`,
        accent
          ? "bg-(--accent) text-(--field)"
          : error
            ? "bg-(--danger) text-(--strong)"
            : "bg-(--fill) text-(--strong)",
      ].join(" ")}
    >
      {children}
    </span>
  );
};
