import * as React from "react";

// @ts-ignore
import styles from "./button.module.scss";
import { cn } from "../../../utils";

type Props = {
  buttonType?: "form" | "3d";
  className?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const ButtonComponent: React.FC<Props> = ({
  className,
  buttonType = "form",
  ...props
}) => {
  return (
    <button
      className={cn(styles.button, className, {
        [styles.threeButton]: buttonType === "3d",
        [styles.formButton]: buttonType === "form",
      })}
      {...props}
    />
  );
};
