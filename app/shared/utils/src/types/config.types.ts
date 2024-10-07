export type ConfigProps<ConfigTypes> = {
  defaults: ConfigTypes;
  values?: ConfigTypes;
  fileName?: string;
};
