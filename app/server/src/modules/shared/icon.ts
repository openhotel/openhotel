import { BACKGROUND_SIZE, ICON_SIZE } from "shared/consts/icon.consts.ts";

export const icon = ($image) => {
  const load = async () => {
    await getIcon();
    await getBackground();
  };

  const getIcon = async () => {
    let iconFile = await Deno.readFile("./assets/icon/icon.png");
    try {
      iconFile = await Deno.readFile("./icon.png");
      const iconImage = await $image.decode(iconFile);
      if (
        iconImage.width !== ICON_SIZE.width ||
        iconImage.height !== ICON_SIZE.height
      )
        throw "Wrong icon size";
    } catch (e) {
      await Deno.copyFile("./assets/icon/icon.png", "./icon.png");
    }
    return iconFile;
  };

  const getBackground = async () => {
    let backgroundFile = await Deno.readFile("./assets/icon/background.png");
    try {
      backgroundFile = await Deno.readFile("./background.png");
      const backgroundImage = await $image.decode(backgroundFile);
      if (
        backgroundImage.width !== BACKGROUND_SIZE.width ||
        backgroundImage.height !== BACKGROUND_SIZE.height
      )
        throw "Wrong background size";
    } catch (e) {
      await Deno.copyFile("./assets/icon/background.png", "./background.png");
    }
    return backgroundFile;
  };

  return {
    load,

    getIcon,
    getBackground,
  };
};
