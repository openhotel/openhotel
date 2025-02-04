import { Image } from "imagescript";
import { BACKGROUND_SIZE, ICON_SIZE } from "shared/consts/icon.consts.ts";

export const icon = () => {
  const load = async () => {
    try {
      const iconImage = await Image.decode(await Deno.readFile("./icon.png"));
      if (
        iconImage.width !== ICON_SIZE.width &&
        iconImage.height !== ICON_SIZE.height
      )
        throw "Wrong icon size";
    } catch (e) {
      await Deno.copyFile("./assets/icon/icon.png", "./icon.png");
    }
    try {
      const backgroundImage = await Image.decode(
        await Deno.readFile("./background.png"),
      );
      if (
        backgroundImage.width !== BACKGROUND_SIZE.width &&
        backgroundImage.height !== BACKGROUND_SIZE.height
      )
        throw "Wrong background size";
    } catch (e) {
      await Deno.copyFile("./assets/icon/background.png", "./background.png");
    }
  };

  return {
    load,
  };
};
