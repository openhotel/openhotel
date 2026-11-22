import React from "react";

type Props = {} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const CheckboxComponent: React.FC<Props> = ({
  className = "",
  ...inputProps
}) => {
  return (
    <input
      type="checkbox"
      className={[
        "accent-(--accent) cursor-pointer",
        "disabled:opacity-55 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
      {...inputProps}
    />
  );
};
