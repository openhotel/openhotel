export type AdditionalVersion = "alpha" | "beta" | "rc";

export type Version = {
  major: number;
  minor: number;
  patch: number;
  additional?: AdditionalVersion;
  additionalPatch?: number;
};
