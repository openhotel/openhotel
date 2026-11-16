import { Arch, OS } from "@shared/enums/os.enums.ts";

export const getOS = (): OS => {
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

export const getOSName = (): string | null => {
  switch (Deno.build.os) {
    case "linux":
    case "darwin":
    case "windows":
      return os;
  }
  return null;
};

export const getArch = (): Arch => {
  switch (Deno.build.arch) {
    case "x86_64":
      return Arch.X64;
    case "aarch64":
      return Arch.ARM;
  }
  return Arch.UNKNOWN;
};
