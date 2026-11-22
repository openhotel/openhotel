import React from "react";

type Props = {
  title: React.ReactNode;
  hint?: string;
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "title"
>;

export const RadioComponent: React.FC<Props> = ({
  title,
  hint,
  className = "",
  ...inputProps
}) => {
  return (
    <div className={`grid gap-2 ${className}`}>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="radio" {...inputProps} />
        <b className="text-(--strong)">{title}</b>
      </label>
      {hint && <span className="text-(--muted)">{hint}</span>}
    </div>
  );
};
