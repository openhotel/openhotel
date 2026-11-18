/**
 * /!\   /!\
 * IMPORTANT
 * **************************************************************
 * Needs same order + release schema as in release.yml workflow!
 * ***************************************************************
 */
export const RELEASE_SCHEMA = 1;
export const RELEASE_PROJECTS = [
  "openhotel",
  "web",
  "static",
  "onet",
  "auth",
  "asset-editor",
] as const;
