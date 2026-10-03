import { System } from "modules/system/main.ts";
import { getS3, S3Mutable } from "@oh/utils";
import {
  COLLECTION_FORMAT_VERSION,
  CollectionManifest,
  getCollectionFurnitureListErrors,
  getCollectionMetadataErrors,
  isValidCollectionId,
} from "@oh/core";
import {
  Collection,
  CollectionFurniture,
  CollectionPublishProps,
  CollectionPublishResult,
} from "shared/types/main.ts";
import { getCollectionFurniture, getVersionErrors } from "shared/utils/main.ts";
import { signature } from "./signature.ts";

export const collections = () => {
  let $bucket: S3Mutable | null = null;
  const $signature = signature();

  const load = async () => {
    const { collections } = System.getConfig();

    const { enabled, ...s3 } = collections.s3;
    if (enabled) {
      $bucket = getS3(s3);
    } else {
      console.warn("Collections bucket is disabled!");
    }

    await $signature.load();
  };

  const isBucketEnabled = () => Boolean($bucket);

  const get = async (id: string): Promise<Collection | null> =>
    (await System.db.get<Collection>(["collections", id])) ?? null;

  const getList = async (): Promise<Collection[]> => {
    const { items } = await System.db.list<Collection>({
      prefix: ["collections"],
    });

    return items.map(({ value }) => value as Collection);
  };

  const register = async (id: string, accountId: string): Promise<boolean> => {
    if (!isValidCollectionId(id) || !accountId) return false;

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
    if (!isValidCollectionId(id)) return false;

    const collection = await get(id);
    return !collection || collection.accountId === accountId;
  };

  const getFurnitureList = async (
    id: string,
  ): Promise<CollectionFurniture[]> => {
    const { items } = await System.db.list<CollectionFurniture>({
      prefix: ["collectionFurniture", id],
    });

    return items.map(({ value }) => value);
  };

  const addVersion = async (
    manifest: CollectionManifest,
    furnitureList: CollectionFurniture[] = [],
  ): Promise<boolean> => {
    const { id, version } = manifest;

    const entry = await System.db.getRaw<Collection>(["collections", id]);
    const collection = entry?.value;
    if (!collection || version !== collection.latestVersion + 1) return false;

    const atomic = System.db.atomic();

    for (const furniture of furnitureList) {
      atomic.set(["collectionFurniture", id, furniture.id], furniture);
    }

    const { ok } = await atomic
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

  const $getPublishErrors = async ({
    id,
    accountId,
    license,
    minHotelVersion,
    category,
    files,
  }: CollectionPublishProps): Promise<string[]> => {
    const errors = getCollectionMetadataErrors({
      id,
      category,
      license,
      minHotelVersion,
    });

    if (isValidCollectionId(id) && !(await canPublish(id, accountId))) {
      errors.push(`namespace '${id}' belongs to another account`);
    }

    errors.push(
      ...getCollectionFurnitureListErrors(id, Object.keys(files ?? {})),
    );

    return errors;
  };

  const publish = async (
    props: CollectionPublishProps,
  ): Promise<CollectionPublishResult> => {
    if (!$bucket) {
      return { errors: ["collections bucket is disabled"] };
    }

    const errors = await $getPublishErrors(props);
    if (errors.length) {
      return { errors };
    }

    const { id, accountId, license, minHotelVersion, category, files } = props;

    const furnitureList: CollectionFurniture[] = [];
    for (const [furnitureId, file] of Object.entries(files)) {
      const { furniture, errors: furnitureErrors } =
        await getCollectionFurniture(id, furnitureId, file);

      if (furniture) {
        furnitureList.push(furniture);
      }
      errors.push(...furnitureErrors);
    }

    if (errors.length) {
      return { errors };
    }

    const versionErrors = getVersionErrors(
      await getFurnitureList(id),
      furnitureList,
    );
    errors.push(...versionErrors);

    if (errors.length) {
      return { errors };
    }

    const isRegistered =
      Boolean(await get(id)) || (await register(id, accountId));

    if (!isRegistered) {
      return {
        errors: [`namespace '${id}' was registered by another account`],
      };
    }

    const collection = await get(id);
    furnitureList.sort((a, b) => a.id.localeCompare(b.id));

    const manifest: CollectionManifest = {
      id,
      version: collection.latestVersion + 1,
      author: accountId,
      license,
      minHotelVersion,
      formatVersion: COLLECTION_FORMAT_VERSION,
      category: {
        label: category.label,
        description: category.description,
      },
      furniture: furnitureList.map(({ id, revision, sha256 }) => ({
        id,
        revision,
        sha256,
      })),
    };
    manifest.signature = await $signature.sign(manifest);

    for (const furniture of furnitureList) {
      await addFile(id, manifest.version, furniture.id, files[furniture.id]);
    }

    const ok = await addVersion(manifest, furnitureList);

    if (!ok) {
      return {
        errors: [
          `failed to add version ${manifest.version} for collection '${id}'`,
        ],
      };
    }

    return { manifest };
  };

  return {
    load,

    isBucketEnabled,

    get,
    getList,
    canPublish,
    register,

    getManifest,
    getLatestManifest,
    addVersion,
    getFurnitureList,

    publish,
    verify: $signature.verify,
    getPublicKey: $signature.getPublicKey,

    addFile,
    getFileUrl,
  };
};
