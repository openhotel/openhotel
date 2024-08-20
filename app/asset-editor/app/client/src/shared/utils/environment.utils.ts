declare const __APP_VERSION: string;

export const getVersion = () => __APP_VERSION || "DEVELOPMENT";
export const isDevelopment = () => getVersion() === "DEVELOPMENT";
