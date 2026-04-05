import * as React from "react";

// @ts-ignore
import styles from "./otp.module.scss";
import { cn } from "../../../utils";
import { useCallback, useId, useMemo, useRef } from "react";
import { BoxComponent, extractBoxProps } from "../../../components";
import type { BoxProps } from "../../../components";

type Props = {
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
  bordered?: boolean;
  length?: number;
} & Partial<BoxProps> &
  React.HTMLProps<HTMLInputElement>;

export const OtpComponent: React.FC<Props> = ({
  className,
  wrapperClassName,
  placeholder,
  bordered,
  length = 6,
  ...props
}) => {
  const id = useId();
  const [otherProps, boxProps] = extractBoxProps<Props>(props);

  const otpValueRef = useRef([]);
  const hiddenInputRef = useRef(null);

  const onChangeInput = useCallback(
    (index: number) => (event) => {
      if (isNaN(parseInt(event.target.value))) {
        event.target.value = null;
        return event.preventDefault();
      }
      try {
        document.activeElement.nextElementSibling.focus();
      } catch (e) {}
      otpValueRef.current[index] = event.target.value;
      hiddenInputRef.current.value = otpValueRef.current.join("");
    },
    [],
  );

  const inputRender = useMemo(() => {
    const inputs = [];
    for (let i = 0; i < length; i++) {
      inputs.push(
        <input
          onChange={onChangeInput(i)}
          id={id + i}
          key={id + i}
          className={cn(styles.input, className)}
          maxLength={1}
        />,
      );
    }
    return inputs;
  }, [length, onChangeInput, id, className]);

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
      <label className={styles.placeholder}>{placeholder}</label>
      <input {...otherProps} ref={hiddenInputRef} type="hidden" />
      <div className={styles.inputs}>{inputRender}</div>
    </BoxComponent>
  );
};
