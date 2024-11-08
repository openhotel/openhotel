import * as React from "react";
import { FormEvent, useCallback, useState } from "react";

// @ts-ignore
import styles from "./form.module.scss";
import { cn } from "../../../utils";

type ValidationFunction<Data = unknown> = (props: {
  value: string;
  addError: (message: string) => void;
  data: Data;
}) => void;

type Props = {
  className?: string;
  onSubmit?: <Data = unknown>(data: Data) => void;
  onError?: (errors: string[]) => void;
  validations?: Record<string | "__custom", ValidationFunction>;
} & React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

export const FormComponent: React.FC<Props> = ({
  className,
  children,
  onSubmit = () => {},
  onError = () => {},
  validations = {},
  ...props
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const $onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const form = event.target as unknown as HTMLFormElement;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData as any);

      const errorList: string[] = [];

      for (const key of Object.keys(data))
        validations[key]?.({
          value: data[key],
          addError: (value) => errorList.push(value),
          data,
        });

      validations["__custom"]?.({
        value: null,
        addError: (value) => errorList.push(value),
        data,
      });

      setErrors(errorList);
      if (errorList.length) return onError(errorList);

      onSubmit(data);
    },
    [validations, onSubmit, onError, setErrors],
  );

  const onClickInputs = useCallback(() => {
    setErrors([]);
  }, [setErrors]);

  return (
    <form
      onSubmit={$onSubmit}
      className={cn(styles.form, className)}
      {...props}
    >
      <div className={styles.inputs} onClick={onClickInputs}>
        {children}
      </div>
      <div className={styles.errors}>
        {errors.map((error) => (
          <label key={error} className={styles.error}>
            {error}
          </label>
        ))}
      </div>
    </form>
  );
};
