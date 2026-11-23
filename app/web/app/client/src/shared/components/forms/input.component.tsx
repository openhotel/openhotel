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

export const InputComponent: React.FC<Props> = ({
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
    >
      <input
        className={[
          "w-full px-1.25 py-1",
          "border border-(--border) bg-(--field) text-(--strong)",
          "shadow-[inset_1px_1px_0_rgba(0,0,0,0.25)]",
          "placeholder:text-(--muted)",
          "focus:outline-2 focus:outline-offset-1 focus:outline-(--accent)",
          "disabled:opacity-55 disabled:cursor-not-allowed",
        ].join(" ")}
        {...inputProps}
      />
    </FieldComponent>
  );
};
