// import Cookies from "js-cookie";

import { getBase64FromBody } from "shared/utils";
import { SpriteSheet } from "shared/types";

export const useSpriteSheets = () => {
  const getList = (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      fetch(`/api/sprite-sheets/list`)
        .then((data) => data.json())
        .then(({ status, data }) => {
          if (status !== 200) return reject({ status });
          resolve(data.list);
        })
        .catch(() => reject({ status: 600 }));
    });

  const getSprite = (id: string): Promise<string> =>
    new Promise((resolve, reject) => {
      fetch(`/api/sprite-sheets/sprite?id=${id}`)
        .then(getBase64FromBody)
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });

  const getSheet = (id: string): Promise<SpriteSheet> =>
    new Promise((resolve, reject) => {
      fetch(`/api/sprite-sheets/sheet?id=${id}`)
        .then((data) => data.json())
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });

  const updateSheet = (id: string, sheet: SpriteSheet): Promise<void> =>
    new Promise((resolve, reject) => {
      fetch(`/api/sprite-sheets/sheet?id=${id}`, {
        method: "post",
        body: JSON.stringify(sheet),
      })
        .then(() => resolve())
        .catch(() => reject({ status: 600 }));
    });

  const uploadSheet = async (id: string, files: FileList) => {
    const formData = new FormData();
    formData.append("files", files[0]);

    return new Promise((resolve, reject) => {
      fetch(`/api/sprite-sheets/sheet?id=${id}`, {
        method: "put",
        body: formData,
      })
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });
  };

  const uploadSprite = async (id: string, files: FileList) => {
    const formData = new FormData();
    formData.append("files", files[0]);

    return new Promise((resolve, reject) => {
      fetch(`/api/sprite-sheets/sprite?id=${id}`, {
        method: "post",
        body: formData,
      })
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });
  };

  const remove = async (id: string) =>
    new Promise((resolve, reject) => {
      fetch(`/api/sprite-sheets/delete?id=${id}`)
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });

  const create = async (id: string) =>
    new Promise((resolve, reject) => {
      fetch(`/api/sprite-sheets/create?id=${id}`)
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });

  return {
    getList,

    getSprite,
    getSheet,

    updateSheet,

    uploadSheet,
    uploadSprite,

    remove,

    create,
  };
};
