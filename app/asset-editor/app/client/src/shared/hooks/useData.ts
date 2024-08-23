// import Cookies from "js-cookie";
import { File } from "shared/types";

export const useData = () => {
  const readDirectory = (path: string): Promise<File[]> =>
    new Promise((resolve, reject) => {
      fetch(`/api/data/read-dir?path=${path}`)
        .then((data) => data.json())
        .then(({ status, data }) => {
          if (status !== 200) return reject({ status });
          resolve(data.list);
        })
        .catch(() => reject({ status: 600 }));
    });

  const getFile = (path: string): Promise<Body> =>
    new Promise((resolve, reject) => {
      fetch(`/api/data/read-file?path=${path}`)
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });

  const addFiles = (path: string, files: FileList): Promise<Body> => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("files", files[i]);

    return new Promise((resolve, reject) => {
      fetch(`/api/data/write-file?path=${path}`, {
        method: "POST",
        body: formData,
      })
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });
  };

  const remove = (path: string): Promise<Body> => {
    return new Promise((resolve, reject) => {
      fetch(`/api/data/rm-file?path=${path}`, {
        method: "GET",
      })
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });
  };

  const createDirectory = (path: string): Promise<Body> => {
    return new Promise((resolve, reject) => {
      fetch(`/api/data/mk-dir?path=${path}`, {
        method: "GET",
      })
        .then(resolve)
        .catch(() => reject({ status: 600 }));
    });
  };

  return {
    readDirectory,
    createDirectory,

    getFile,
    addFiles,
    remove,
  };
};
