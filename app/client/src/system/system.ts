import { proxy } from "system/proxy";

export const System = (() => {
  const $proxy = proxy();

  return {
    proxy: $proxy,
  };
})();
