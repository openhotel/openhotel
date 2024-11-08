import * as React from "react";

// @ts-ignore
import styles from "./input.module.scss";
import { cn } from "../../../utils";

type Props = {
  className?: string;
} & React.HTMLProps<HTMLInputElement>;

export const InputComponent: React.FC<Props> = ({ className, ...props }) => {
  return <input className={cn(styles.input, className)} {...props} />;
};
