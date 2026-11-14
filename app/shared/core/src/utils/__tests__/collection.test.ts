import { expect, describe, it } from "@jest/globals";
import {
  getCollectionFurnitureListErrors,
  getCollectionManifestErrors,
  getCollectionManifestPayload,
  getCollectionMetadataErrors,
  getSha256,
  getStableJson,
  isValidCollectionFurnitureId,
  isValidCollectionId,
  isValidHotelVersion,
  verifyCollectionManifest,
} from "../collection.utils.ts";
import type { CollectionManifest } from "../../types/main.ts";

const PUBLIC_KEY = "MC8uZMUTGtSzRzgrCvpCSZt0OPLGkBVujh0PkQSFBbA";
const OTHER_PUBLIC_KEY = "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo";

const getManifest = (): CollectionManifest => ({
  id: "xmas",
  version: 2,
  author: "account-id",
  license: undefined,
  minHotelVersion: "0.9.0",
  formatVersion: 1,
  category: { label: "Xmas", description: undefined },
  furniture: [
    {
      id: "xmas@tree-0",
      revision: "01JABCDEFGHJKMNPQRSTVWXYZ0",
      sha256: "a".repeat(64),
    },
    {
      id: "xmas@tree-1",
      revision: "01JABCDEFGHJKMNPQRSTVWXYZ1",
      sha256: "b".repeat(64),
    },
  ],
  signature:
    "ZENd555RYiUFfk8MKCc2P9HCXGAeRR8h2Ep9ocbz8eHwviT0DFGXiwCJcYPeIOHN6RV+JOo7g5vsQ1TGP1BOAQ==",
});

describe("utils", () => {
  describe("collection", () => {
    describe("getSha256", () => {
      it("returns the hex sha256", async () => {
        expect(await getSha256(new TextEncoder().encode("abc"))).toEqual(
          "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
        );
      });
    });

    describe("getStableJson", () => {
      it("sorts keys at any depth", () => {
        expect(
          getStableJson({ b: 1, a: { d: [1, { f: 1, e: 2 }], c: 2 } }),
        ).toEqual('{"a":{"c":2,"d":[1,{"e":2,"f":1}]},"b":1}');
      });

      it("skips undefined values in objects and turns them into null in lists", () => {
        expect(getStableJson({ a: undefined, b: [undefined, 1] })).toEqual(
          '{"b":[null,1]}',
        );
      });

      it("keeps primitives as JSON", () => {
        expect(getStableJson("a")).toEqual('"a"');
        expect(getStableJson(1)).toEqual("1");
        expect(getStableJson(null)).toEqual("null");
        expect(getStableJson(true)).toEqual("true");
      });
    });

    describe("isValidHotelVersion", () => {
      it("accepts versions", () => {
        for (const version of ["0.9.0", "v1.2.3", "1.0.0-beta", "1.0.0-rc.1"])
          expect(isValidHotelVersion(version)).toBe(true);
      });

      it("rejects anything else", () => {
        for (const version of ["1.0", "latest", "1.0.0-", undefined, 100])
          expect(isValidHotelVersion(version)).toBe(false);
      });
    });

    describe("isValidCollectionId", () => {
      it("accepts kebab-case ids", () => {
        expect(isValidCollectionId("xmas")).toBe(true);
        expect(isValidCollectionId("my-things-2")).toBe(true);
      });

      it("rejects invalid, too long and reserved ids", () => {
        for (const id of [
          "Xmas",
          "my_things",
          "-xmas",
          "xmas-",
          "a".repeat(33),
          "default",
          "openhotel",
          "",
          undefined,
        ])
          expect(isValidCollectionId(id)).toBe(false);
      });
    });

    describe("isValidCollectionFurnitureId", () => {
      it("accepts <collection>@<name>", () => {
        expect(isValidCollectionFurnitureId("xmas", "xmas@tree-0")).toBe(true);
      });

      it("rejects other collections and invalid names", () => {
        for (const id of [
          "flags@pirate",
          "xmas@",
          "xmas@Tree",
          "xmas@tree@0",
          "xmas",
          undefined,
        ])
          expect(isValidCollectionFurnitureId("xmas", id)).toBe(false);
      });
    });

    describe("getCollectionMetadataErrors", () => {
      it("returns no errors for a valid collection.yml", () => {
        expect(
          getCollectionMetadataErrors({
            id: "xmas",
            category: { label: "Xmas", description: "Christmas furniture" },
            license: "CC-BY-NC-SA-4.0",
            minHotelVersion: "0.9.0",
          }),
        ).toEqual([]);
      });

      it("returns every error", () => {
        expect(
          getCollectionMetadataErrors({
            id: "default",
            category: { label: "", description: "a".repeat(257) },
            license: "",
            minHotelVersion: "latest",
          }),
        ).toEqual([
          "id 'default' is not valid",
          "minHotelVersion is not a valid version",
          "category.label is not valid",
          "category.description is not valid",
          "license is not valid",
        ]);
      });

      it("doesn't throw with empty values", () => {
        expect(getCollectionMetadataErrors(undefined)).toHaveLength(3);
      });
    });

    describe("getCollectionFurnitureListErrors", () => {
      it("returns no errors for a valid list", () => {
        expect(
          getCollectionFurnitureListErrors("xmas", [
            "xmas@tree-0",
            "xmas@tree-1",
          ]),
        ).toEqual([]);
      });

      it("returns duplicated and invalid ids", () => {
        expect(
          getCollectionFurnitureListErrors("xmas", [
            "xmas@tree-0",
            "xmas@tree-0",
            "flags@pirate",
          ]),
        ).toEqual([
          "xmas@tree-0: id is duplicated",
          "flags@pirate: id must be 'xmas@<name>'",
        ]);
      });

      it("requires between 1 and 250 furniture", () => {
        const error = "a collection must have between 1 and 250 furniture";
        expect(getCollectionFurnitureListErrors("xmas", [])).toEqual([error]);
        expect(
          getCollectionFurnitureListErrors(
            "xmas",
            Array.from({ length: 251 }, (_, index) => `xmas@tree-${index}`),
          ),
        ).toEqual([error]);
      });
    });

    describe("getCollectionManifestErrors", () => {
      it("returns no errors for a valid manifest", () => {
        expect(getCollectionManifestErrors(getManifest())).toEqual([]);
      });

      it("allows unknown keys", () => {
        expect(
          getCollectionManifestErrors({ ...getManifest(), newField: true }),
        ).toEqual([]);
      });

      it("returns every error", () => {
        expect(
          getCollectionManifestErrors({
            ...getManifest(),
            version: 0,
            author: "",
            formatVersion: 2,
            signature: 1,
            furniture: [
              { id: "xmas@tree-0", revision: "", sha256: "a".repeat(64) },
              { id: "xmas@tree-0", revision: "01J", sha256: "nope" },
              { id: "flags@pirate", revision: "01J", sha256: "a".repeat(64) },
              "xmas@tree-2",
            ],
          }),
        ).toEqual([
          "version must be an integer >= 1",
          "author is not valid",
          "formatVersion '2' is not supported",
          "signature is not valid",
          "furniture[0].revision is not valid",
          "furniture[1].id 'xmas@tree-0' is duplicated",
          "furniture[1].sha256 is not valid",
          "furniture[2].id must be 'xmas@<name>'",
          "furniture[3] must be an object",
        ]);
      });

      it("requires a furniture list", () => {
        expect(
          getCollectionManifestErrors({ ...getManifest(), furniture: [] }),
        ).toEqual(["furniture must be a list of 1 to 250 items"]);
      });

      it("rejects anything that is not an object", () => {
        expect(getCollectionManifestErrors(null)).toEqual([
          "manifest must be an object",
        ]);
      });
    });

    describe("getCollectionManifestPayload", () => {
      it("is the stable json without the signature", () => {
        expect(
          new TextDecoder().decode(getCollectionManifestPayload(getManifest())),
        ).toEqual(
          '{"author":"account-id","category":{"label":"Xmas"},"formatVersion":1,"furniture":[{"id":"xmas@tree-0","revision":"01JABCDEFGHJKMNPQRSTVWXYZ0","sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},{"id":"xmas@tree-1","revision":"01JABCDEFGHJKMNPQRSTVWXYZ1","sha256":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}],"id":"xmas","minHotelVersion":"0.9.0","version":2}',
        );
      });
    });

    describe("verifyCollectionManifest", () => {
      it("verifies a manifest signed by onet", async () => {
        expect(
          await verifyCollectionManifest(getManifest(), [PUBLIC_KEY]),
        ).toBe(true);
      });

      it("accepts any of the keys", async () => {
        expect(
          await verifyCollectionManifest(getManifest(), [
            OTHER_PUBLIC_KEY,
            PUBLIC_KEY,
          ]),
        ).toBe(true);
      });

      it("ignores key order in the manifest", async () => {
        const { signature, furniture, ...manifest } = getManifest();
        expect(
          await verifyCollectionManifest(
            { signature, furniture, ...manifest } as CollectionManifest,
            [PUBLIC_KEY],
          ),
        ).toBe(true);
      });

      it("rejects a modified manifest", async () => {
        const manifest = getManifest();
        manifest.furniture[0].sha256 = "c".repeat(64);
        expect(await verifyCollectionManifest(manifest, [PUBLIC_KEY])).toBe(
          false,
        );
      });

      it("rejects another key", async () => {
        expect(
          await verifyCollectionManifest(getManifest(), [OTHER_PUBLIC_KEY]),
        ).toBe(false);
      });

      it("rejects missing or broken signatures and keys", async () => {
        expect(
          await verifyCollectionManifest(
            { ...getManifest(), signature: undefined },
            [PUBLIC_KEY],
          ),
        ).toBe(false);
        expect(
          await verifyCollectionManifest(
            { ...getManifest(), signature: "not base64!" },
            [PUBLIC_KEY],
          ),
        ).toBe(false);
        expect(
          await verifyCollectionManifest(getManifest(), ["not a key"]),
        ).toBe(false);
        expect(await verifyCollectionManifest(getManifest(), [])).toBe(false);
      });
    });
  });
});
