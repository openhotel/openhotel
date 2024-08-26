import { FurnitureData, FurnitureLang } from "shared/types";
import { downloadURI } from "shared/utils";

export const useFurniture = () => {
  const path = `/api/furniture`;

  const getList = (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      fetch(`${path}/list`)
        .then((data) => data.json())
        .then(({ status, data }) => {
          if (status !== 200) return reject({ status });
          resolve(data.list);
        })
        .catch(() => reject({ status: 600 }));
    });

  const getData = (id: string): Promise<FurnitureData> =>
    new Promise((resolve, reject) => {
      fetch(`${path}/data?id=${id}`)
        .then((data) => data.json())
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });

  const updateData = (id: string, data: FurnitureData): Promise<void> =>
    new Promise((resolve, reject) => {
      fetch(`${path}/data?id=${id}`, {
        method: "post",
        body: JSON.stringify(data),
      })
        .then(() => resolve())
        .catch(() => reject({ status: 600 }));
    });

  const getLang = (id: string): Promise<FurnitureLang> =>
    new Promise((resolve, reject) => {
      fetch(`${path}/lang?id=${id}`)
        .then((data) => data.json())
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });

  const updateLang = (id: string, lang: FurnitureLang): Promise<void> =>
    new Promise((resolve, reject) => {
      fetch(`${path}/lang?id=${id}`, {
        method: "post",
        body: JSON.stringify(lang),
      })
        .then(() => resolve())
        .catch(() => reject({ status: 600 }));
    });

  const remove = async (id: string) =>
    new Promise((resolve, reject) => {
      fetch(`${path}/delete?id=${id}`)
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });

  const create = async (id: string) =>
    new Promise((resolve, reject) => {
      fetch(`${path}/create?id=${id}`)
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });

  const exportZip = (id: string) => {
    downloadURI(`${path}/export?id=${id}`, `${id}.zip`);
  };

  return {
    getList,

    getData,
    getLang,

    updateData,
    updateLang,

    remove,

    create,
    exportZip,
  };
};
