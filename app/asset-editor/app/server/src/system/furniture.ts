import { System } from "system/main.ts";
import { FurnitureData, FurnitureLang } from "shared/types/main.ts";

const FURNITURE_PATH = "/furniture";

export const furniture = () => {
  const load = async () => {
    await System.data.mkdir(FURNITURE_PATH);

    await create("example");
  };

  const $getPath = (path: string) => `${FURNITURE_PATH}/${path}`;

  const getList = async (): Promise<string[]> => {
    const files = await System.data.readDir(FURNITURE_PATH);
    return files.filter((file) => file.isDirectory).map((file) => file.name);
  };

  const create = async (id: string) => {
    const path = $getPath(id);
    await System.data.mkdir(path);

    const data: FurnitureData = {
      version: 1,
      id,
    };
    const lang: FurnitureLang = {
      en: {
        label: "example",
        description: "example description",
      },
    };

    await updateData(id, data);
    await updateLang(id, lang);
  };

  const updateData = async (id: string, data: FurnitureData) =>
    System.data.yaml.write($getPath(id) + "/data.yml", data);

  const updateLang = async (id: string, data: FurnitureLang) =>
    System.data.yaml.write($getPath(id) + "/lang.yml", data);

  const getData = (id: string): Promise<FurnitureData> =>
    System.data.yaml.read<FurnitureData>($getPath(id) + "/data.yml");

  const getLang = (id: string): Promise<FurnitureLang> =>
    System.data.yaml.read<FurnitureLang>($getPath(id) + "/lang.yml");

  const remove = async (id: string) => {
    // await System.data.remove($getPath(id) + "/data.yml");
    // await System.data.remove($getPath(id) + "/lang.yml");
    await System.data.remove($getPath(id));
  };

  return {
    load,

    create,

    getList,

    getData,
    updateData,

    getLang,
    updateLang,

    remove,
  };
};
