export const version = () => {
  let $version = "v0.0.0";
  let $development = true;

  const load = async () => {
    const { data } = await fetch(`/version`).then((response) =>
      response.json(),
    );
    $version = data.version;
    $development = data.development;
  };

  const isDevelopment = () => $development;
  const getVersion = () => $version;

  return {
    load,
    isDevelopment,
    getVersion,
  };
};
