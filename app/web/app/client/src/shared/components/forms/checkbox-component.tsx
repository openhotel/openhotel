import React from "react";
import { FieldProps } from "shared/types/field.types.ts";
import { FieldComponent } from "shared/components/forms/field.component.tsx";

type Props = FieldProps &
  Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "title"
  >;

export const CheckboxComponent: React.FC<Props> = ({
  title,
  hint,
  error,
  className = "",
  ...inputProps
}) => {
  return (
    <FieldComponent
      title={title}
      hint={hint}
      error={error}
      className={className}
      inline
    >
      <input
        type="checkbox"
        className={[
          "accent-(--accent) cursor-pointer",
          "disabled:opacity-55 disabled:cursor-not-allowed",
        ].join(" ")}
        {...inputProps}
      />
    </FieldComponent>
  );
};
