import React from "react";

type Props = {
  accent?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const ButtonComponent: React.FC<Props> = ({
  accent = false,
  className = "",
  ...buttonProps
}) => {
  return (
    <button
      className={`
        border border-(--border) font-bold px-4 py-1.5 cursor-pointer
        shadow-[inset_1px_1px_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_rgba(0,0,0,0.35)]
        hover:brightness-110
        active:shadow-[inset_1px_1px_0_rgba(0,0,0,0.35)]
        focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--accent)
        disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:brightness-100
        disabled:active:shadow-[inset_1px_1px_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_rgba(0,0,0,0.35)]
        ${accent ? "bg-(--accent) text-(--accent-ink)" : "bg-(--fill) text-(--strong)"}
        ${className}
      `}
      {...buttonProps}
    />
  );
};
