import { OS } from "shared/enums/main.ts";

export const getOS = () => {
  switch (Deno.build.os) {
    case "linux":
      return OS.LINUX;
    case "darwin":
      return OS.DARWIN;
  }
  return OS.UNKNOWN;
};

export const getOSName = () => {
  const { os } = Deno.build;
  switch (os) {
    case "linux":
    case "darwin":
      return os;
  }
  return undefined;
};
