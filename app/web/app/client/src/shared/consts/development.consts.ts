export const IS_DEV = import.meta.env.DEV;

export const SETUP_DEBUG =
  true && IS_DEV && localStorage.getItem("setup_debug") === "true";
