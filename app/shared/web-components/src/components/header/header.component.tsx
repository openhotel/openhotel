import * as React from "react";

type Props = {
  label: string;
  backgroundColor?: string;
};

export const Header: React.FC<Props> = ({
  backgroundColor,
  label,
  ...props
}) => {
  return (
    <button
      type="button"
      style={backgroundColor ? { backgroundColor } : {}}
      {...props}
    >
      {label}
    </button>
  );
};
