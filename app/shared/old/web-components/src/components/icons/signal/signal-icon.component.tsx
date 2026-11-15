import React, { useMemo } from "react";
import { NoSignalIconComponent } from "./no-signal-icon.component";
import { LowSignalIconComponent } from "./low-signal-icon.component";
import { MediumSignalIconComponent } from "./medium-signal-icon.component";
import { HighSignalIconComponent } from "./high-signal-icon.component";
import { FullSignalIconComponent } from "./full-signal-icon.component";
import { cn, getSignal } from "../../../utils";
import { Signal } from "../../../enums";

//@ts-ignore
import styles from "./signal-icon.module.scss";

type Props = {
  className?: string;
  ms?: number;
};

export const SignalIconComponent: React.FC<Props> = ({ className, ms }) => {
  const signal = useMemo(() => getSignal(ms), [ms]);

  if (signal === Signal.NONE)
    return <NoSignalIconComponent className={cn(className, styles.none)} />;
  if (signal === Signal.LOW)
    return <LowSignalIconComponent className={cn(className, styles.low)} />;
  if (signal === Signal.MEDIUM)
    return (
      <MediumSignalIconComponent className={cn(className, styles.medium)} />
    );
  if (signal === Signal.HIGH)
    return <HighSignalIconComponent className={cn(className, styles.high)} />;
  return <FullSignalIconComponent className={cn(className, styles.full)} />;
};
