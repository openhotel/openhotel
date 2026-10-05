import React, { useCallback, useEffect, useState } from "react";
import {
  FileInputComponent,
  TableComponent,
  UploadIconComponent,
} from "@openhotel/web-components";
import { Collection, CollectionManifest } from "shared/types";
import { useCollections } from "shared/hooks";
import dayjs from "dayjs";
import styles from "./collections.module.scss";

type Props = {} & React.HTMLProps<HTMLDivElement>;

export const CollectionsComponent: React.FC<Props> = () => {
  const { get, upload } = useCollections();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [published, setPublished] = useState<CollectionManifest>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const $reload = useCallback(
    () =>
      get()
        .then((collections) => {
          setCollections(collections);
          setIsAvailable(true);
        })
        .catch(() => setIsAvailable(false)),
    [get],
  );

  useEffect(() => {
    $reload();
  }, []);

  const onUploadCollection = useCallback(
    async ([file]: File[]) => {
      if (!file?.size || isUploading) return;

      setIsUploading(true);
      setPublished(null);
      setErrors([]);

      try {
        const manifest = await upload(file);
        setPublished(manifest);
        await $reload();
      } catch (e) {
        setErrors(
          e?.data?.errors?.length
            ? e.data.errors
            : ["The collection could not be uploaded, try again later"],
        );
      }

      setIsUploading(false);
    },
    [upload, $reload, isUploading],
  );

  return (
    <div className={styles.collections}>
      <h2>Collections</h2>
      {!isAvailable ? (
        <label>Collections are not available right now</label>
      ) : (
        <div className={styles.upload}>
          <FileInputComponent
            accept=".collection"
            disabled={isUploading}
            onChange={onUploadCollection}
          >
            <UploadIconComponent className={styles.icon} />
            <span>
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  Upload <b>*.collection</b> file
                </>
              )}
            </span>
          </FileInputComponent>
          {published ? (
            <label>
              Published {published.id} version {published.version}
            </label>
          ) : null}
          {errors.length ? (
            <ul className={styles.errors}>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

      {isAvailable ? (
        <TableComponent
          title="Collections"
          searchable={true}
          pageRows={20}
          data={collections.map((collection) => ({
            ...collection,
            name: collection.category?.label ?? "-",
            version: collection.latestVersion || "-",
            updated: dayjs(collection.updatedAt).format("YYYY/MM/DD HH:mm"),
          }))}
          columns={[
            {
              key: "id",
              label: "Id",
            },
            {
              key: "name",
              label: "Name",
            },
            {
              key: "version",
              label: "Version",
            },
            {
              key: "furnitureCount",
              label: "Furniture",
            },
            {
              key: "updated",
              label: "Updated",
            },
          ]}
        />
      ) : null}
    </div>
  );
};
