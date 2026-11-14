import * as React from "react";

// @ts-ignore
import styles from "./button.module.scss";
import { cn } from "../../../utils";
import {
  BoxComponent,
  extractBoxProps,
  LoadingIconComponent,
} from "../../../components";
import type { BoxProps } from "../../../components";

type Props = {
  variant?: "plain" | "3d";
  color?: "blue" | "yellow" | "grey" | "dark" | "light";
  className?: string;
  fullWidth?: boolean;
  loading?: boolean;
} & Partial<BoxProps> &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;

export const ButtonComponent: React.FC<Props> = ({
  className,
  variant = "plain",
  color = "blue",
  fullWidth,
  loading = false,
  disabled = false,
  children,
  ...props
}) => {
  const [otherProps, boxProps] = extractBoxProps<Props>(props);

  return (
    <BoxComponent {...boxProps} className={styles.buttonWrapper}>
      <button
        className={cn(
          styles.button,
          {
            [styles.threeDVariant]: variant === "3d",
            [styles.plainVariant]: variant === "plain",
            [styles.colorBlue]: color === "blue",
            [styles.colorYellow]: color === "yellow",
            [styles.colorGrey]: color === "grey",
            [styles.colorDark]: color === "dark",
            [styles.colorLight]: color === "light",
            [styles.fullWidth]: !!fullWidth,
            [styles.loading]: loading,
            [styles.disabled]: disabled,
          },
          className,
        )}
        {...otherProps}
        disabled={disabled}
      >
        {loading ? (
          <>
            <div className={styles.content}>{children}</div>
            <div className={styles.loadingIcon}>
              <LoadingIconComponent width={16} />
            </div>
          </>
        ) : (
          children
        )}
      </button>
    </BoxComponent>
  );
};
