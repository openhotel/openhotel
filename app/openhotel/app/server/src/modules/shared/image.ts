export const image = () => {
  let $Image;
  const load = async () => {
    const { Image } = await import("imagescript");
    $Image = Image;
  };

  const getImage = () => $Image;

  return {
    load,

    getImage,
  };
};
