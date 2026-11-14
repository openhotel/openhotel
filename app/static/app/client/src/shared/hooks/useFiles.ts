import { useApi } from "./useApi";
import { useCallback, useState } from "react";
import { RequestMethod } from "shared/enums";
import { File } from "../types/index.ts";
import { useAppSession } from "./useAppSession.tsx";

export const useFiles = () => {
  const { fetch } = useApi();
  const { getHeaders } = useAppSession();

  const [files, setFiles] = useState<File[]>([]);
  const [cursor, setCursor] = useState<string>();

  const getList = useCallback(async () => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: "files",
      headers: getHeaders(),
      params: {
        limit: 5,
        ...(cursor ? { cursor } : {}),
      },
    });

    setFiles(($files) => [...$files, ...data.files]);
    setCursor(data.nextCursor);
  }, [fetch, setFiles, setCursor, cursor]);

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
    cursor,

    getList,
    uploadFile,
    deleteFile,
  };
};
