import * as React from "react";

// @ts-ignore
import styles from "./input.module.scss";
import { cn } from "../../../utils";
import { useId } from "react";
import { BoxComponent, extractBoxProps } from "../../../components";
import type { BoxProps } from "../../../components";

type Props = {
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
  bordered?: boolean;
} & Partial<BoxProps> &
  React.HTMLProps<HTMLInputElement>;

export const InputComponent: React.FC<Props> = ({
  className,
  wrapperClassName,
  placeholder,
  bordered,
  ...props
}) => {
  const id = useId();
  const [otherProps, boxProps] = extractBoxProps<Props>(props);

  return (
    <BoxComponent
      {...boxProps}
      className={cn(
        styles.inputWrapper,
        wrapperClassName,
        [styles.bordered, !!bordered],
        { [styles.disabled]: props.disabled },
      )}
    >
      <input
        id={id}
        className={cn(styles.input, className, {
          [styles.hasPlaceholder]: !!placeholder,
        })}
        placeholder={placeholder}
        {...otherProps}
      />
      {placeholder ? (
        <label className={styles.placeholder} htmlFor={id}>
          {placeholder}
        </label>
      ) : null}
    </BoxComponent>
  );
};
