import { BACKGROUND_SIZE, ICON_SIZE } from "shared/consts/icon.consts.ts";
import { Proxy } from "modules/proxy/main.ts";

export const icon = () => {
  const load = async () => {
    await getIcon();
    await getBackground();
  };

  const getIcon = async () => {
    const $image = Proxy.image.getImage();
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
      console.error(e);
      await Deno.copyFile("./assets/icon/icon.png", "./icon.png");
    }
    return iconFile;
  };

  const getBackground = async () => {
    const $image = Proxy.image.getImage();
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
      console.error(e);
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
