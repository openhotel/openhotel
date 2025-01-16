declare const __APP_VERSION: { version: string };

export const getInternalVersion = (): string =>
  __APP_VERSION.version === "__VERSION__"
    ? "development"
    : __APP_VERSION.version;
