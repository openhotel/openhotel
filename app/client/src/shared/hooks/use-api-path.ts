import { useCallback } from "react";
import { useConfig } from "shared/hooks";

export const useApiPath = () => {
  const { isDevelopment } = useConfig();

  const getPath = useCallback(
    (pathname: string) => {
      return `${isDevelopment() ? "proxy" : ""}/api${pathname}`;
    },
    [isDevelopment],
  );

  return { getPath };
};
