import { useCallback, useEffect, useState } from "react";
import { isDarkMode } from "shared/utils/dark.utils.ts";

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState<boolean>(isDarkMode());

  const onChange = useCallback(
    (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    },
    [setDarkMode],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", onChange);
  }, [onChange]);

  return { darkMode };
};
