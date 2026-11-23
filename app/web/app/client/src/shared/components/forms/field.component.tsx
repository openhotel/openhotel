import React from "react";
import { FieldProps } from "shared/types/field.types.ts";

type Props = {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
} & FieldProps;

export const FieldComponent: React.FC<Props> = ({
  title,
  hint,
  error,
  inline = false,
  className = "",
  children,
}) => {
  const Wrapper = inline ? "div" : "label";

  return (
    <Wrapper
      className={[
        "flex flex-col text-(--ink)",
        inline ? "gap-0.5" : "gap-2",
        error
          ? "[&_:is(input,select,textarea)]:border-(--danger)! [&_:is(input,select,textarea)]:outline-(--danger)!"
          : "",
        className,
      ].join(" ")}
    >
      {inline ? (
        <label className="flex items-center gap-3 cursor-pointer">
          {children}
          {title && <b className="text-(--strong)">{title}</b>}
        </label>
      ) : (
        <>
          {title}
          {children}
        </>
      )}
      {error ? <span className="text-(--danger) ">{error}</span> : null}
      {hint && <span className="text-(--muted)">{hint}</span>}
    </Wrapper>
  );
};
