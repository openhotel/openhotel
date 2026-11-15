import React, { useCallback, useEffect, useRef } from "react";

export const useClickOutside = (ref: React.MutableRefObject<HTMLElement>) => {
  const callbackRef = useRef<Function | null>(null);

  const $onClickOutside = useCallback(
    (event) => {
      if (ref?.current && !ref.current.contains(event.target))
        callbackRef.current?.();
    },
    [ref],
  );

  useEffect(() => {
    document.addEventListener("mousedown", $onClickOutside);

    return () => {
      document.removeEventListener("mousedown", $onClickOutside);
    };
  }, [$onClickOutside]);

  const onClickOutside = useCallback((callback: Function) => {
    callbackRef.current = callback;
  }, []);

  return {
    onClickOutside,
  };
};
