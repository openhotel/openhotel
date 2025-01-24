import React, { useCallback, useEffect, useState } from "react";

export const useClickOutside = (ref: React.MutableRefObject<HTMLElement>) => {
  const [callback, setCallback] = useState<Function | null>(null);

  const $onClickOutside = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target)) callback?.();
    },
    [ref],
  );

  useEffect(() => {
    document.addEventListener("mousedown", $onClickOutside);

    return () => {
      document.removeEventListener("mousedown", $onClickOutside);
    };
  }, [$onClickOutside]);

  const onClickOutside = useCallback(
    (callback: Function) => {
      setCallback(callback);
    },
    [setCallback],
  );

  return {
    onClickOutside,
  };
};
