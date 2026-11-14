import { useCallback, useEffect, useState } from "react";
import { isDarkMode as $isDarkMode } from "../utils";

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>($isDarkMode());

  const onChange = useCallback(
    (event) => {
      setIsDarkMode(event.matches);
    },
    [setIsDarkMode],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", onChange);
  }, [onChange]);

  return { isDarkMode };
};
