import React from "react";
import { FieldComponent } from "shared/components/forms/field.component.tsx";
import { FieldProps } from "shared/types/field.types.ts";

type Props = FieldProps &
  Omit<
    React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    "title"
  >;

export const SelectComponent: React.FC<Props> = ({
  title,
  hint,
  error,
  className = "",
  children,
  ...selectProps
}) => {
  return (
    <FieldComponent
      title={title}
      hint={hint}
      error={error}
      className={className}
    >
      <select
        className={[
          "w-full p-0.75 cursor-pointer",
          "border border-(--border) bg-(--field) text-(--strong)",
          "shadow-[inset_1px_1px_0_rgba(0,0,0,0.25)]",
          "focus:outline-2 focus:outline-offset-1 focus:outline-(--accent)",
          "disabled:opacity-55 disabled:cursor-not-allowed",
        ].join(" ")}
        {...selectProps}
      >
        {children}
      </select>
    </FieldComponent>
  );
};
