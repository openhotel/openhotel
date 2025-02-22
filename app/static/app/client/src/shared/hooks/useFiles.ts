import { useApi } from "./useApi";
import { useCallback, useState } from "react";
import { RequestMethod } from "shared/enums";
import { File } from "../types/index.ts";
import { useAppSession } from "./useAppSession.tsx";

export const useFiles = () => {
  const { fetch } = useApi();
  const { getHeaders } = useAppSession();

  const [files, setFiles] = useState<File[]>([]);

  const getList = useCallback(async () => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: "files",
      headers: getHeaders(),
    });

    setFiles(data.files);
  }, [fetch]);

  const uploadFile = useCallback(
    async (formData) => {
      const { data } = await fetch({
        method: RequestMethod.PUT,
        pathname: "files",
        headers: getHeaders(),
        formData: true,
        body: formData,
      });

      await getList();
      return data;
    },
    [fetch],
  );

  const deleteFile = useCallback(
    (fileId: string) => async () => {
      await fetch({
        method: RequestMethod.DELETE,
        pathname: "files",
        headers: getHeaders(),
        body: { id: fileId },
      });

      await getList();
    },
    [fetch],
  );

  return {
    files,
    getList,
    uploadFile,
    deleteFile,
  };
};
