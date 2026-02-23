import React, { useCallback } from "react";
import { SpriteSheet } from "shared/types";
import {
  ButtonComponent,
  BYIconComponent,
  ConfirmationModalComponent,
  FileInputComponent,
  UploadIconComponent,
  useModal,
} from "@openhotel/web-components";
import { FurnitureDataFormComponent } from "../furniture-data-form";
import { Data, useApi, useAppSession, useFurniture } from "shared/hooks";
import { SpriteSheetFormComponent } from "modules/sprite-sheet";
import { TabContentComponent } from "shared/components";

//@ts-ignore
import styles from "./create.module.scss";
import { getBase64FromBody, getImageSize } from "shared/utils";
import { RequestMethod } from "shared/enums";
import { ulid } from "ulidx";

export const CreateFurnitureComponent: React.FC = () => {
  const { setData, data } = useFurniture();
  const { open, close } = useModal();
  const { fetch: fetchApi } = useApi();
  const { getHeaders } = useAppSession();

  const onClickCreate = useCallback(async () => {
    const base64 = await getBase64FromBody(await fetch("/furniture.png"));
    const size = await getImageSize("/furniture.png");

    setData({
      sprite: base64,
      sheet: {
        frames: {},
        meta: {
          size: {
            w: size.width,
            h: size.height,
          },
          format: "RGBA8888",
          scale: 1,
          image: "sprite.png",
        },
        animations: {},
      },
      furniture: {
        id: "new@furniture",
        revision: ulid(),
      },
      lang: {},
    });
  }, []);

  const onDownloadFurniture = useCallback(async () => {
    const downloadData: Data = {
      ...data,
      sheet: {
        ...data.sheet,
        frames: Object.keys(data.sheet.frames).reduce((frameMap, frame) => {
          //removes the temp value __key
          delete data.sheet.frames[frame]["__key"];
          return {
            ...frameMap,
            [frame]: data.sheet.frames[frame],
          };
        }, {}),
      },
      furniture: { ...data.furniture, revision: ulid() },
    };
    const response = await fetchApi({
      pathname: "furniture/create",
      method: RequestMethod.POST,
      body: JSON.stringify(downloadData),
      headers: getHeaders(),
      rawResponse: true,
    });

    const reader = response.body.getReader();

    // Step 2: get total length
    // const contentLength = +response.headers.get("Content-Length");

    // Step 3: read the data
    let receivedLength = 0; // received that many bytes at the moment
    let chunks = []; // array of received binary chunks (comprises the body)
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;
    }

    const blob = new Blob(chunks);

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${data.furniture.id}.furniture`;
    link.click();
  }, [data]);

  const onUploadFurniture = useCallback(
    async (files: File[]) => {
      const formData = new FormData();
      formData.append("file", files[0]);

      setData(null);

      const { data } = await fetchApi({
        pathname: "furniture/import",
        method: RequestMethod.POST,
        body: formData,
        headers: getHeaders(),
      });
      setData(data);
    },
    [setData],
  );

  const onChangeSpriteSheet = useCallback(
    (sheet: SpriteSheet, sprite: string) => {
      setData({
        ...data,
        sheet,
        sprite: sprite ?? data.sprite,
      });
    },
    [data, setData],
  );

  const onClear = () => {
    setData(null);
  };

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <FileInputComponent accept=".furniture" onChange={onUploadFurniture}>
          <UploadIconComponent className={styles.icon} />
          <span>
            Upload <b>*.furniture</b> file
          </span>
        </FileInputComponent>
        <div className={styles.right}>
          {data ? (
            <>
              <ButtonComponent
                className={styles.button}
                color="grey"
                onClick={() =>
                  open({
                    children: (
                      <ConfirmationModalComponent
                        description="Are you sure?"
                        onConfirm={onClear}
                        onClose={close}
                      />
                    ),
                  })
                }
              >
                Clear
              </ButtonComponent>
              <ButtonComponent
                className={styles.button}
                onClick={onDownloadFurniture}
              >
                <BYIconComponent className={styles.icon} /> Download furniture
              </ButtonComponent>
            </>
          ) : (
            <ButtonComponent
              color="yellow"
              className={styles.button}
              onClick={onClickCreate}
            >
              Create from scratch
            </ButtonComponent>
          )}
        </div>
      </div>
      {data ? (
        <>
          <TabContentComponent className={styles.form} title="Sprite Sheet">
            <SpriteSheetFormComponent
              sprite={data.sprite}
              sheet={data.sheet}
              onChange={onChangeSpriteSheet}
              disabled={false}
            />
          </TabContentComponent>
          <TabContentComponent className={styles.form} title="Furniture Data">
            <FurnitureDataFormComponent />
          </TabContentComponent>
        </>
      ) : null}
    </div>
  );
};
