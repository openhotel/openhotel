import * as React from "react";

type Props = {
  label: string;
  backgroundColor?: string;
};

export const Button: React.FC<Props> = ({
  backgroundColor,
  label,
  ...props
}) => {
  return (
    <button
      type="button"
      style={backgroundColor ? { backgroundColor } : { color: "green" }}
      {...props}
    >
      {label}
    </button>
  );
};
