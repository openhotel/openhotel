import React from "react";
import { Props } from "shared/types/react.types.ts";

export const LabelComponent: React.FC<
  Props<{
    accent?: boolean;
  }>
> = ({ accent, children }) => {
  return (
    <span
      className={`border border-(--border) ${accent ? "bg-(--accent) text-(--field)" : "bg-(--fill) text-(--strong)"} px-2 text-sm font-bold uppercase tracking-wide`}
    >
      {children}
    </span>
  );
};
