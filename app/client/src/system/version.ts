export const version = () => {
  let $version = "v0.0.0";

  const load = async () => {
    const { data } = await fetch(`/version`).then((response) =>
      response.json(),
    );
    $version = data.version;

    const lastVersion = localStorage.getItem("version");
    localStorage.setItem("version", $version);

    console.log(lastVersion, $version);
    // TODO: compare versions and launch modal with specific changelog
  };

  const isDevelopment = () => $version === "development";
  const getVersion = () => $version;

  return {
    load,
    isDevelopment,
    getVersion,
  };
};
