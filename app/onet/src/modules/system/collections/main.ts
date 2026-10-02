import { System } from "modules/system/main.ts";
import { getS3, S3Mutable } from "@oh/utils";
import { Collection, CollectionManifest } from "shared/types/main.ts";
import {
  COLLECTION_ID_MAX_LENGTH,
  COLLECTION_ID_REGEX,
  COLLECTION_RESERVED_NAMESPACES,
} from "shared/consts/main.ts";

export const collections = () => {
  let $bucket: S3Mutable | null = null;

  const load = () => {
    const { collections } = System.getConfig();

    const { enabled, ...s3 } = collections.s3;
    if (enabled) {
      $bucket = getS3(s3);
    } else {
      console.warn("Collections bucket is disabled!");
    }
  };

  const isBucketEnabled = () => Boolean($bucket);

  const isValidId = (id: string): boolean =>
    typeof id === "string" &&
    id.length <= COLLECTION_ID_MAX_LENGTH &&
    COLLECTION_ID_REGEX.test(id) &&
    !COLLECTION_RESERVED_NAMESPACES.includes(id);

  const get = async (id: string): Promise<Collection | null> =>
    (await System.db.get<Collection>(["collections", id])) ?? null;

  const getList = async (): Promise<Collection[]> => {
    const { items } = await System.db.list<Collection>({
      prefix: ["collections"],
    });

    return items.map(({ value }) => value as Collection);
  };

  const register = async (id: string, accountId: string): Promise<boolean> => {
    if (!isValidId(id) || !accountId) return false;

    const now = Date.now();
    const collection: Collection = {
      id,
      accountId,
      latestVersion: 0,
      createdAt: now,
      updatedAt: now,
    };

    const { ok } = await System.db
      .atomic()!
      .check({ key: ["collections", id], versionstamp: null })
      .set(["collections", id], collection)
      .commit();

    return ok;
  };

  const getManifest = async (
    id: string,
    version: number,
  ): Promise<CollectionManifest | null> =>
    (await System.db.get<CollectionManifest>([
      "collectionManifests",
      id,
      version,
    ])) ?? null;

  const getLatestManifest = async (
    id: string,
  ): Promise<CollectionManifest | null> => {
    const collection = await get(id);
    if (!collection?.latestVersion) return null;

    return getManifest(id, collection.latestVersion);
  };

  const canPublish = async (
    id: string,
    accountId: string,
  ): Promise<boolean> => {
    if (!isValidId(id)) return false;

    const collection = await get(id);
    return !collection || collection.accountId === accountId;
  };

  const addVersion = async (manifest: CollectionManifest): Promise<boolean> => {
    const { id, version } = manifest;

    const entry = await System.db.getRaw<Collection>(["collections", id]);
    const collection = entry?.value;
    if (!collection || version !== collection.latestVersion + 1) return false;

    const { ok } = await System.db
      .atomic()!
      .check(entry)
      .set(["collectionManifests", id, version], manifest)
      .set(["collections", id], {
        ...collection,
        latestVersion: version,
        updatedAt: Date.now(),
      })
      .commit();
    return ok;
  };

  const $getFileKey = (id: string, version: number, furnitureId: string) =>
    `collections/${id}/${version}/${furnitureId}.furniture`;

  const addFile = async (
    id: string,
    version: number,
    furnitureId: string,
    data: Uint8Array,
  ): Promise<void> => {
    if (!$bucket) throw new Error("Collections bucket is disabled!");

    await $bucket.addObject($getFileKey(id, version, furnitureId), data);
  };

  const getFileUrl = (
    id: string,
    version: number,
    furnitureId: string,
    expirySeconds: number,
  ): Promise<string> => {
    if (!$bucket) throw new Error("Collections bucket is disabled!");

    return $bucket.getPresignedUrl(
      $getFileKey(id, version, furnitureId),
      expirySeconds,
    );
  };

  return {
    load,

    isBucketEnabled,
    isValidId,

    get,
    getList,
    canPublish,
    register,

    getManifest,
    getLatestManifest,
    addVersion,

    addFile,
    getFileUrl,
  };
};
