import Cookies from "js-cookie";
import { useCallback, useMemo } from "react";

export const useCookies = () => {
  const set = useCallback((key: string, value: string, expires?: number) => {
    Cookies.set(key, value, {
      expires,
      sameSite: "strict",
      secure: true,
    });
  }, []);

  const get = useMemo(() => Cookies.get, []);
  const remove = useMemo(() => Cookies.remove, []);

  return {
    set,
    get,
    remove,
  };
};
