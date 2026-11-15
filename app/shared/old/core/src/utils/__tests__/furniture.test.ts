import { expect, describe, it } from "@jest/globals";
import {
  getFurnitureDataErrors,
  getFurnitureFilesErrors,
  getFurnitureImmutableData,
  getFurnitureLangErrors,
  getFurnitureSheetErrors,
  getFurnitureSheetFrames,
} from "../furniture.utils.ts";
import type { FurnitureDataFile } from "../../types/main.ts";

const FURNITURE_ID = "xmas@tree-0";

const getLang = (): any => ({
  en: { name: "Tree", description: "A christmas tree" },
  es: { name: "Árbol", description: "" },
});

const getSheet = (): any => ({
  frames: {
    icon: { frame: { x: 0, y: 0, w: 10, h: 10 } },
    "tree-north": {
      frame: { x: 10, y: 0, w: 20, h: 40 },
      sourceSize: { w: 20, h: 40 },
      rotated: false,
      trimmed: false,
    },
    "tree-south": { frame: { x: 30, y: 0, w: 20, h: 40 } },
  },
  meta: { image: "sprite.png", size: { w: 50, h: 40 }, scale: "1" },
});

const getData = (): any => ({
  id: FURNITURE_ID,
  type: "furniture",
  revision: "01JABCDEFGHJKMNPQRSTVWXYZ0",
  icon: { texture: "icon", bounds: { width: 10, height: 10 } },
  size: { width: 1, height: 2, depth: 1 },
  direction: {
    south: {
      textures: [
        {
          texture: "tree-south",
          pivot: { x: -10, y: 5 },
          position: { x: 0, z: 0 },
          zIndex: 1,
          bounds: { width: 20, height: 40 },
        },
      ],
    },
    north: { textures: [{ texture: "tree-north" }] },
  },
});

const FRAMES = ["icon", "tree-north", "tree-south"];

describe("utils", () => {
  describe("furniture", () => {
    describe("getFurnitureLangErrors", () => {
      it("returns no errors for a valid lang.yml", () => {
        expect(getFurnitureLangErrors(getLang())).toEqual([]);
      });

      it("requires at least one language", () => {
        for (const lang of [{}, undefined, [], "en"])
          expect(getFurnitureLangErrors(lang)).toEqual([
            "lang.yml must have at least one language",
          ]);
      });

      it("returns every error", () => {
        expect(
          getFurnitureLangErrors({
            eng: { name: "Tree", description: "" },
            es: { name: "", description: "a".repeat(257) },
            fr: { name: "Arbre", description: "", label: "Arbre" },
            de: "Baum",
          }),
        ).toEqual([
          "lang.yml.eng is not a valid language code",
          "lang.yml.es.name is not valid",
          "lang.yml.es.description is not valid",
          "lang.yml.fr.label is not allowed",
          "lang.yml.de must be an object",
        ]);
      });
    });

    describe("getFurnitureSheetErrors", () => {
      it("returns no errors for a valid sheet.json", () => {
        expect(getFurnitureSheetErrors(getSheet())).toEqual([]);
      });

      it("returns every error", () => {
        const sheet = getSheet();
        sheet.meta.image = "other.png";
        sheet.animations = [];
        sheet.frames.icon.frame.x = -1;
        sheet.frames["tree-north"].extra = true;
        sheet.frames["tree-south"].frame = { x: 0, y: 0 };
        expect(getFurnitureSheetErrors(sheet)).toEqual([
          "sheet.json.meta.image must be 'sprite.png'",
          "sheet.json.animations must be an object",
          "sheet.json.frames.icon.frame must be integers >= 0",
          "sheet.json.frames.tree-north.extra is not allowed",
          "sheet.json.frames.tree-south.frame.w is required",
          "sheet.json.frames.tree-south.frame.h is required",
        ]);
      });

      it("requires frames and meta", () => {
        expect(getFurnitureSheetErrors({ other: 1 })).toEqual([
          "sheet.json.frames is required",
          "sheet.json.meta is required",
          "sheet.json.other is not allowed",
        ]);
      });
    });

    describe("getFurnitureSheetFrames", () => {
      it("returns the frame names", () => {
        expect(getFurnitureSheetFrames(getSheet())).toEqual(FRAMES);
      });

      it("returns an empty list without a valid structure", () => {
        expect(getFurnitureSheetFrames(undefined)).toEqual([]);
        expect(getFurnitureSheetFrames({ frames: [], meta: {} })).toEqual([]);
      });
    });

    describe("getFurnitureDataErrors", () => {
      it("returns no errors for a valid data.yml", () => {
        expect(getFurnitureDataErrors(FURNITURE_ID, getData(), FRAMES)).toEqual(
          [],
        );
      });

      it("returns every error", () => {
        const data = getData();
        data.id = "xmas@tree-1";
        data.type = "wall";
        data.icon.texture = "missing";
        data.size.depth = -1;
        data.direction.east = { textures: "tree-east" };
        data.direction.up = { textures: [] };
        expect(getFurnitureDataErrors(FURNITURE_ID, data, FRAMES)).toEqual([
          "data.yml.id must be 'xmas@tree-0'",
          "data.yml.type must be one of furniture, frame",
          "data.yml.icon.texture 'missing' is not a frame of sheet.json",
          "data.yml.size.depth must be an integer >= 0",
          "data.yml.direction.up is not allowed",
        ]);
      });

      it("checks every texture", () => {
        const data = getData();
        data.direction.east = { textures: "tree-east" };
        data.direction.south.textures.push(
          { texture: "tree-south", zIndex: 1.5, pivot: { x: 0 } },
          { texture: "tree-south", position: { x: 0, y: 0 }, hitArea: [] },
        );
        expect(getFurnitureDataErrors(FURNITURE_ID, data, FRAMES)).toEqual([
          "data.yml.direction.south.textures[1].zIndex must be an integer >= -Infinity",
          "data.yml.direction.south.textures[1].pivot.y is required",
          "data.yml.direction.south.textures[2].hitArea is not allowed",
          "data.yml.direction.east.textures must be a list",
        ]);
      });

      it("requires the main keys", () => {
        expect(
          getFurnitureDataErrors(FURNITURE_ID, { id: FURNITURE_ID }, FRAMES),
        ).toEqual([
          "data.yml.type is required",
          "data.yml.revision is required",
          "data.yml.icon is required",
          "data.yml.size is required",
          "data.yml.direction is required",
        ]);
      });
    });

    describe("getFurnitureFilesErrors", () => {
      it("returns no errors for valid files", () => {
        expect(
          getFurnitureFilesErrors(FURNITURE_ID, {
            data: getData(),
            sheet: getSheet(),
            lang: getLang(),
          }),
        ).toEqual([]);
      });

      it("checks the textures against the frames of sheet.json", () => {
        const sheet = getSheet();
        delete sheet.frames.icon;
        expect(
          getFurnitureFilesErrors(FURNITURE_ID, {
            data: getData(),
            sheet,
            lang: getLang(),
          }),
        ).toEqual([
          "data.yml.icon.texture 'icon' is not a frame of sheet.json",
        ]);
      });

      it("returns the errors of lang.yml, sheet.json and data.yml in order", () => {
        expect(
          getFurnitureFilesErrors(FURNITURE_ID, {
            data: { ...getData(), type: "wall" },
            sheet: { ...getSheet(), meta: undefined },
            lang: {},
          }),
        ).toEqual([
          "lang.yml must have at least one language",
          "sheet.json.meta is required",
          "data.yml.type must be one of furniture, frame",
          "data.yml.icon.texture 'icon' is not a frame of sheet.json",
          "data.yml.direction.south.textures[0].texture 'tree-south' is not a frame of sheet.json",
          "data.yml.direction.north.textures[0].texture 'tree-north' is not a frame of sheet.json",
        ]);
      });
    });

    describe("getFurnitureImmutableData", () => {
      it("returns type, size and sorted directions", () => {
        expect(
          getFurnitureImmutableData(getData() as FurnitureDataFile),
        ).toEqual({
          type: "furniture",
          size: { width: 1, height: 2, depth: 1 },
          directions: ["north", "south"],
        });
      });
    });
  });
});
