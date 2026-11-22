import React from "react";
import { useTheme } from "shared/hooks/use-theme.tsx";
import { Link } from "react-router";

type Props = {
  className?: string;
};

export const LogoComponent: React.FC<Props> = ({ className = "" }) => {
  const { darkMode } = useTheme();

  return (
    <div className="relative min-w-[128px] min-h-[113px] z-10">
      <img
        src={
          darkMode ? "/logo-bg/dark-bg-logo.png" : "/logo-bg/light-bg-logo.png"
        }
        className={`absolute pixelated max-w-none shrink-0 ${className}`}
        alt="logo background"
      />
      <Link to="/">
        <img
          src="/logo.png"
          className={`absolute top-3 left-4 pixelated max-w-none w-auto h-auto shrink-0 ${className}`}
          alt="logo"
        />
      </Link>
    </div>
  );
};
