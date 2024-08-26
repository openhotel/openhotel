import React, {
  useEffect,
  useState,
  ChangeEvent,
  useRef,
  FormEvent,
  useMemo,
} from "react";
import { useData } from "shared/hooks";
import { File } from "shared/types";
import { downloadURI, getBase64FromBody } from "shared/utils";
import { parse } from "yaml";
import styles from "./file-manager.module.scss";

export const FileManagerComponent: React.FC = () => {
  const { readDirectory, getFile, addFiles, remove, createDirectory } =
    useData();

  const uploadRef = useRef();

  const [path, setPath] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const [currentFile, setCurrentFile] = useState<File>();
  const [currentFileData, setCurrentFileData] = useState<{
    data: string;
    format: "image" | "text" | "json";
  }>();

  useEffect(() => {
    if (!currentFile) return setCurrentFileData(null);

    getFile(path + "/" + currentFile.name).then(async (data) => {
      if (currentFile.name.endsWith(".png")) {
        return setCurrentFileData({
          data: await getBase64FromBody(data),
          format: "image",
        });
      }
      if (currentFile.name.endsWith(".yml")) {
        return setCurrentFileData({
          data: parse(await data.text()),
          format: "json",
        });
      }
      if (currentFile.name.endsWith(".json")) {
        return setCurrentFileData({
          data: await data.json(),
          format: "json",
        });
      }
      return setCurrentFileData({
        data: await data.text(),
        format: "text",
      });
    });
  }, [currentFile]);

  const loadFiles = () => {
    setCurrentFile(null);
    setCurrentFileData(null);
    readDirectory(path).then(setFiles);
  };

  useEffect(() => {
    loadFiles();
  }, [path]);

  const onClickBack = () => {
    if (path === "/") return;
    const pathArr = path.split("/");
    setPath(pathArr.slice(0, pathArr.length - 1).join("/"));
  };

  const onClickFile = (file: File) => async () => {
    if (file.isDirectory) setPath((path) => path + "/" + file.name);

    if (file.isFile) setCurrentFile(file);
  };
  const onClickDeleteFile = (file: File) => async () => {
    await remove(path + `/${file.name}`);
    loadFiles();
  };
  const onClickDownload = (file: File) => async () => {
    downloadURI(
      `/api/data/read-file?path=${path + "/" + file.name}`,
      file.name,
    );
  };

  const onUploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    await addFiles(path, files);
    loadFiles();
    //@ts-ignore
    uploadRef.current.value = "";
  };

  const onCreateDirectory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const name = data.get("name") as string;

    if (!name.length) return;

    const targetPath = path + `/${name}`;
    //@ts-ignore
    event.target.reset();
    await createDirectory(targetPath);
    loadFiles();
    setPath(targetPath);
  };

  const sortedFiles = useMemo(
    () => files.toSorted((fileA, fileB) => (fileA.isDirectory ? -1 : 1)),
    [files],
  );

  return (
    <div className={styles.container}>
      <div className={styles.path}>
        {path || "/"}
        {currentFile?.name ? `/${currentFile?.name}` : ""}
      </div>
      <hr />
      <div className={styles.files}>
        <div onClick={onClickBack} className={styles.back}>
          {path ? "⪻" : "|"}
        </div>
        {sortedFiles.map((file) => (
          <div key={file.name} className={styles.file}>
            <label onClick={onClickFile(file)} className={styles.name}>
              {file.isDirectory ? "/" : ""}
              {file.name}
            </label>
            {file.isFile ? (
              <button onClick={onClickDownload(file)}>download</button>
            ) : null}
            <button onClick={onClickDeleteFile(file)}>delete</button>
          </div>
        ))}
      </div>
      <hr />
      <div className={styles.actions}>
        <button onClick={loadFiles}>Reload</button>
        <form onSubmit={onCreateDirectory}>
          <input name="name" placeholder="Folder Name" />
          <button>+</button>
        </form>
        <div>
          <button>
            <label htmlFor="uploadFile">Upload Files</label>
          </button>
          <input
            id="uploadFile"
            hidden
            ref={uploadRef}
            type="file"
            multiple
            onChange={onUploadFiles}
          />
        </div>
      </div>
      <div className={styles.preview}>
        {currentFileData ? (
          <>
            {currentFileData.format === "json" ? (
              <textarea readOnly value={JSON.stringify(currentFileData.data)} />
            ) : null}
            {currentFileData.format === "text" ? (
              <textarea readOnly value={currentFileData.data} />
            ) : null}
            {currentFileData.format === "image" ? (
              <img alt="" src={currentFileData.data} />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};
