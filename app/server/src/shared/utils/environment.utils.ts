let $version = "DEVELOPMENT";
export const $setEnvironment = ({ version }) => {
  if (version !== "__VERSION__") $version = version;
};

export const getVersion = () => $version;

export const isDevelopment = () => getVersion() === "DEVELOPMENT";
