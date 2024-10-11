export const version = () => {
  let $version = "v0.0.0";

  const load = async () => {
    const { data } = await fetch(`/version`).then((response) =>
      response.json(),
    );
    $version = data.version;
  };

  const isDevelopment = () => $version === "development";
  const getVersion = () => $version;

  return {
    load,
    isDevelopment,
    getVersion,
  };
};
