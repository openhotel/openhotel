import React, { useCallback, useMemo, useState } from "react";
import {
  ButtonComponent,
  BYIconComponent,
  ConfirmationModalComponent,
  FileInputComponent,
  InputComponent,
  UploadIconComponent,
  useModal,
} from "@openhotel/web-components";
import { useApi, useAppSession } from "shared/hooks";
import { TabContentComponent } from "shared/components";
import { RequestMethod } from "shared/enums";
import { CollectionData, CollectionFurniture } from "shared/types";
import { cn, getCollectionFurnitureErrors } from "shared/utils";
import {
  COLLECTION_DESCRIPTION_MAX_LENGTH,
  COLLECTION_ID_MAX_LENGTH,
  COLLECTION_LABEL_MAX_LENGTH,
  type CollectionMetadata,
  getCollectionFurnitureListErrors,
  getCollectionMetadataErrors,
} from "@oh/core";

//@ts-ignore
import styles from "./create.module.scss";

const getFurnitureName = ({ lang }: CollectionFurniture) =>
  (lang?.en ?? Object.values(lang ?? {})[0])?.name ?? "";

export const CreateCollectionComponent: React.FC = () => {
  const { open, close } = useModal();
  const { fetch: fetchApi } = useApi();
  const { getHeaders } = useAppSession();

  const [data, setData] = useState<CollectionData>(null);
  const [requestError, setRequestError] = useState<string>(null);

  const collectionErrors = useMemo(
    () => (data ? getCollectionMetadataErrors(data.collection) : []),
    [data],
  );
  const furnitureErrors = useMemo(
    () =>
      (data?.furniture ?? []).map((furniture) =>
        getCollectionFurnitureErrors(furniture),
      ),
    [data],
  );
  const furnitureListErrors = useMemo(
    () =>
      data
        ? getCollectionFurnitureListErrors(
            data.collection.id,
            data.furniture.map(({ id }) => id),
          )
        : [],
    [data],
  );

  const hasErrors =
    collectionErrors.length > 0 ||
    furnitureListErrors.length > 0 ||
    furnitureErrors.some((errors) => errors.length);

  const onClickCreate = useCallback(() => {
    setRequestError(null);
    setData({
      collection: {
        id: "",
        category: { label: "" },
        minHotelVersion: "",
      },
      furniture: [],
    });
  }, [setData]);

  const onUploadCollection = useCallback(
    async (files: File[]) => {
      const formData = new FormData();
      formData.append("file", files[0]);

      setData(null);
      setRequestError(null);

      try {
        const {
          data: { collection, furniture },
        } = await fetchApi({
          pathname: "collection/import",
          method: RequestMethod.POST,
          body: formData,
          headers: getHeaders(),
        });

        setData({
          collection: {
            id: collection.id ?? "",
            category: {
              label: collection.category?.label ?? "",
              description: collection.category?.description || undefined,
            },
            minHotelVersion: collection.minHotelVersion ?? "",
          },
          furniture,
        });
      } catch (e) {
        setRequestError(e?.message ?? "Invalid collection file");
      }
    },
    [fetchApi, getHeaders, setData],
  );

  const onAddFurniture = useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      setRequestError(null);

      try {
        const {
          data: { furniture },
        } = await fetchApi({
          pathname: "collection/furniture",
          method: RequestMethod.POST,
          body: formData,
          headers: getHeaders(),
        });

        setData((data) => {
          const ids = furniture.map(({ id }) => id);
          return {
            ...data,
            furniture: [
              ...data.furniture.filter(({ id }) => !ids.includes(id)),
              ...furniture,
            ],
          };
        });
      } catch (e) {
        setRequestError(e?.message ?? "Invalid furniture file");
      }
    },
    [fetchApi, getHeaders, setData],
  );

  const onRemoveFurniture = useCallback(
    (index: number) => () =>
      setData((data) => ({
        ...data,
        furniture: data.furniture.filter((_, $index) => $index !== index),
      })),
    [setData],
  );

  const onChangeCollection = useCallback(
    (key: keyof CollectionMetadata | "label" | "description") =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value =
          key === "description"
            ? event.target.value || undefined
            : event.target.value;

        setData((data) => ({
          ...data,
          collection:
            key === "label" || key === "description"
              ? {
                  ...data.collection,
                  category: { ...data.collection.category, [key]: value },
                }
              : { ...data.collection, [key]: value },
        }));
      },
    [setData],
  );

  const onDownloadCollection = useCallback(async () => {
    if (hasErrors) return;

    setRequestError(null);

    const response = await fetchApi({
      pathname: "collection/create",
      method: RequestMethod.POST,
      body: JSON.stringify({
        collection: data.collection,
        furniture: data.furniture.map(({ id, file }) => ({ id, file })),
      }),
      headers: getHeaders(),
      rawResponse: true,
    });

    if (!response.ok) {
      const { message } = await response.json().catch(() => ({}));
      return setRequestError(message ?? "Collection can't be created");
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(await response.blob());
    link.download = `${data.collection.id}.collection`;
    link.click();
  }, [data, hasErrors, fetchApi, getHeaders]);

  const onClear = () => {
    setData(null);
    setRequestError(null);
    close();
  };

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <FileInputComponent accept=".collection" onChange={onUploadCollection}>
          <UploadIconComponent className={styles.icon} />
          <span>
            Upload <b>*.collection</b> file
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
                onClick={onDownloadCollection}
                disabled={hasErrors}
              >
                <BYIconComponent className={styles.icon} /> Download collection
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
      {requestError ? (
        <div className={styles.errors}>
          {requestError.split("\n").map((error) => (
            <span key={error}>{error}</span>
          ))}
        </div>
      ) : null}
      {data ? (
        <>
          <TabContentComponent
            className={styles.form}
            title="Collection"
            defaultShow
          >
            <div className={styles.column}>
              {collectionErrors.length ? (
                <div className={styles.errors}>
                  {collectionErrors.map((error) => (
                    <span key={error}>{error}</span>
                  ))}
                </div>
              ) : null}

              <div className={styles.row}>
                <InputComponent
                  placeholder="id"
                  value={data.collection.id}
                  maxLength={COLLECTION_ID_MAX_LENGTH}
                  onChange={onChangeCollection("id")}
                />
                <InputComponent
                  placeholder="minHotelVersion"
                  value={data.collection.minHotelVersion}
                  onChange={onChangeCollection("minHotelVersion")}
                />
              </div>
              <div className={styles.row}>
                <InputComponent
                  placeholder="category.label"
                  value={data.collection.category.label}
                  maxLength={COLLECTION_LABEL_MAX_LENGTH}
                  onChange={onChangeCollection("label")}
                />
              </div>
              <InputComponent
                placeholder="category.description (optional)"
                value={data.collection.category.description ?? ""}
                maxLength={COLLECTION_DESCRIPTION_MAX_LENGTH}
                onChange={onChangeCollection("description")}
              />
            </div>
          </TabContentComponent>
          <TabContentComponent
            className={styles.form}
            title={`Furnitures (${data.furniture.length})`}
            defaultShow
          >
            <div className={styles.list}>
              {furnitureListErrors.length ? (
                <div className={styles.errors}>
                  {furnitureListErrors.map((error) => (
                    <span key={error}>{error}</span>
                  ))}
                </div>
              ) : null}

              {data.furniture.map((furniture, index) => (
                <div
                  key={`${furniture.id}-${index}`}
                  className={cn(styles.column, styles.item)}
                >
                  <div className={styles.row}>
                    <b className={styles.grow}>{furniture.id}</b>
                    <span className={styles.grow}>
                      {getFurnitureName(furniture)}
                    </span>
                    <span>{(furniture.size / 1024).toFixed(1)} KB</span>
                    <ButtonComponent
                      color="grey"
                      onClick={onRemoveFurniture(index)}
                    >
                      Remove
                    </ButtonComponent>
                  </div>
                  {furnitureErrors[index]?.length ? (
                    <div className={styles.errors}>
                      {furnitureErrors[index].map((error) => (
                        <span key={error}>{error}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              <FileInputComponent
                accept=".furniture"
                multiple
                onChange={onAddFurniture}
              >
                <UploadIconComponent className={styles.icon} />
                <span>
                  Add <b>*.furniture</b> files
                </span>
              </FileInputComponent>
            </div>
          </TabContentComponent>
        </>
      ) : null}
    </div>
  );
};
