import React from "react";

export type Props<P = {}> = P & {
  className?: string;
} & React.PropsWithChildren;
