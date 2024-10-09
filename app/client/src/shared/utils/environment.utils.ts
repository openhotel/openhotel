declare const __APP_VERSION: string;

export const getInternalVersion = () => __APP_VERSION || "DEVELOPMENT";
