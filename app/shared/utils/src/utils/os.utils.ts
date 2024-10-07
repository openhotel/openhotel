import { OS } from "../enums/main.ts";

export const getOS = () => {
  switch (Deno.build.os) {
    case "linux":
      return OS.LINUX;
    case "darwin":
      return OS.DARWIN;
    case "windows":
      return OS.WINDOWS;
  }
  return OS.UNKNOWN;
};

export const getOSName = () => {
  const { os } = Deno.build;
  switch (os) {
    case "linux":
    case "darwin":
    case "windows":
      return os;
  }
  return undefined;
};
