import React, { FormEvent, useEffect, useState } from "react";
import styles from "./furniture.module.scss";
import { useFurniture, useSpriteSheets } from "shared/hooks";
import { FurnitureData, FurnitureLang, SpriteSheet } from "shared/types";
import { SpriteFrameComponent } from "shared/components/sprite-frame";
import { FurnitureDirection, FurnitureType } from "shared/enums";
import { SelectComponent } from "shared/components/select";
import { FurnitureComponent, SceneComponent } from "shared/components";

type Props = {
  furnitureId: string;
  onDelete: () => void;
  onClose: (id: string) => void;
};

export const FurnitureItemComponent: React.FC<Props> = ({
  furnitureId,
  onDelete,
  onClose,
}) => {
  const { getSheet, getSprite } = useSpriteSheets();
  const { getLang, getData, updateData, exportZip } = useFurniture();
  const [scale] = useState(2);

  const [furnitureSheet, setFurnitureSheet] = useState<SpriteSheet>();
  const [furnitureSprite, setFurnitureSprite] = useState<string>();

  const [furnitureLang, setFurnitureLang] = useState<FurnitureLang>();
  const [furnitureData, setFurnitureData] = useState<FurnitureData>();

  const reload = () => {
    getLang(furnitureId).then(setFurnitureLang).catch(onClose);
    getData(furnitureId).then(setFurnitureData).catch(onClose);
    getSheet(furnitureId).then(setFurnitureSheet).catch(onClose);
    getSprite(furnitureId).then(setFurnitureSprite).catch(onClose);
  };

  useEffect(() => {
    reload();
  }, [furnitureId]);

  const onExport = () => {
    exportZip(furnitureId);
  };

  const onChangeType = async (type: FurnitureType) => {
    await updateData(furnitureId, {
      ...furnitureData,
      type,
    });
    reload();
  };

  const onChangeIcon = async (texture: string) => {
    const { w, h } = furnitureSheet.frames[texture].frame;
    await updateData(furnitureId, {
      ...furnitureData,
      icon: {
        texture,
        bounds: {
          width: w,
          height: h,
        },
      },
    });
    reload();
  };

  const onSubmitAddTexture =
    (direction: FurnitureDirection) =>
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const spriteId = data.get("sprite") as string;
      const pivotX = parseInt(data.get("pivotX") as string);
      const pivotY = parseInt(data.get("pivotY") as string);
      const positionX = parseInt(data.get("positionX") as string);
      const positionZ = parseInt(data.get("positionZ") as string);
      const zIndex = parseInt(data.get("zIndex") as string);

      if (!spriteId) return;

      const { w, h } = furnitureSheet.frames[spriteId].frame;
      await updateData(furnitureId, {
        ...furnitureData,
        direction: {
          ...(furnitureData?.direction || {}),
          [direction]: {
            ...(furnitureData?.direction?.[direction] || {}),
            textures: [
              ...(furnitureData?.direction?.[direction]?.textures || []).filter(
                (texture) => texture.texture !== spriteId,
              ),
              {
                texture: spriteId,
                bounds: {
                  width: w,
                  height: h,
                },
                pivot: {
                  x: pivotX,
                  y: pivotY,
                },
                position: {
                  x: positionX,
                  z: positionZ,
                },
                zIndex,
              },
            ],
          },
        },
      });
      reload();
    };

  const onDeleteDirectionTexture =
    (direction: FurnitureDirection, textureId: string) => async () => {
      await updateData(furnitureId, {
        ...furnitureData,
        direction: {
          ...(furnitureData?.direction || {}),
          [direction]: {
            ...(furnitureData?.direction?.[direction] || {}),
            textures: (
              furnitureData?.direction?.[direction]?.textures || []
            ).filter((texture) => texture.texture !== textureId),
          },
        },
      });
      reload();
    };

  const onChangeWidth = async (event) => {
    await updateData(furnitureId, {
      ...furnitureData,
      bounds: {
        ...furnitureData.bounds,
        width: parseInt(event.target.value),
      },
    });
    reload();
  };

  const onChangeDepth = async (event) => {
    await updateData(furnitureId, {
      ...furnitureData,
      bounds: {
        ...furnitureData.bounds,
        depth: parseInt(event.target.value),
      },
    });
    reload();
  };

  const onChangeHeight = async (event) => {
    await updateData(furnitureId, {
      ...furnitureData,
      bounds: {
        ...furnitureData.bounds,
        height: parseInt(event.target.value),
      },
    });
    reload();
  };

  if (!furnitureLang || !furnitureData || !furnitureSheet || !furnitureSprite)
    return <div />;

  const sprites = Object.keys(furnitureSheet?.frames || {});

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.actions}>
          <button onClick={onExport}>export</button>
          <button className={styles.delete} onClick={onDelete}>
            delete
          </button>
        </div>
      </div>
      <hr />
      <div>
        <span>type: </span>
        <SelectComponent
          list={["", "frame", "furniture"]}
          onChange={onChangeType}
          value={furnitureData.type}
        />
      </div>
      <hr />
      <div style={{ display: "flex", gap: "1rem" }}>
        <span>size: </span>
        <input
          placeholder="width"
          value={furnitureData?.bounds?.width}
          defaultValue={1}
          onChange={onChangeWidth}
          type="number"
        />
        <input
          placeholder="depth"
          value={furnitureData?.bounds?.depth}
          defaultValue={1}
          onChange={onChangeDepth}
          type="number"
        />
        <input
          placeholder="height"
          value={furnitureData?.bounds?.height}
          defaultValue={1}
          onChange={onChangeHeight}
          type="number"
        />
      </div>
      <hr />
      <div>
        <span>actions: </span>
        <form>
          <SelectComponent name="sprite" list={["", "sit"]} />
          <button>+</button>
        </form>
      </div>
      <hr />
      <div>
        <span>icon:</span>
        <SelectComponent
          list={["", ...sprites]}
          onChange={onChangeIcon}
          value={furnitureData?.icon?.texture}
        />
        {furnitureData?.icon?.texture &&
        furnitureSheet?.frames?.[furnitureData?.icon?.texture]?.frame &&
        furnitureSheet ? (
          <SpriteFrameComponent
            sprite={furnitureSprite}
            size={furnitureSheet.meta.size}
            frame={
              furnitureSheet?.frames?.[furnitureData?.icon?.texture]?.frame
            }
            scale={2}
          />
        ) : null}
      </div>
      <hr />
      <hr />
      {Object.values(FurnitureDirection).map((direction) => (
        <div key={direction} className={styles.direction}>
          <span>{direction}:</span>
          <div className={styles.data}>
            <div className={styles.textures}>
              <span>textures:</span>
              <div className={styles.header}>
                <span>texture</span>
                <span>pivot x</span>
                <span>pivot y</span>
                <span>position x</span>
                <span>position z</span>
                <span>zIndex</span>
                <span></span>
              </div>
              <div className={styles.list}>
                {furnitureData?.direction?.[direction]?.textures?.map(
                  ({ texture, pivot, position, zIndex }) => (
                    <div key={texture} className={styles.item}>
                      <span>{texture} </span>
                      <span>{pivot.x}</span>
                      <span>{pivot.y}</span>
                      <span>{position?.x}</span>
                      <span>{position?.z}</span>
                      <span>{zIndex}</span>
                      <button
                        onClick={onDeleteDirectionTexture(direction, texture)}
                      >
                        delete
                      </button>
                    </div>
                  ),
                )}
                <form onSubmit={onSubmitAddTexture(direction)}>
                  <SelectComponent name="sprite" list={sprites} />
                  <input
                    type="number"
                    name="pivotX"
                    placeholder="pivot x"
                    defaultValue="0"
                  />
                  <input
                    type="number"
                    name="pivotY"
                    placeholder="pivot y"
                    defaultValue="0"
                  />
                  <input
                    type="number"
                    name="positionX"
                    placeholder="position x"
                    defaultValue="0"
                  />
                  <input
                    type="number"
                    name="positionZ"
                    placeholder="position z"
                    defaultValue="0"
                  />
                  <input
                    type="number"
                    name="zIndex"
                    placeholder="zIndex"
                    defaultValue="0"
                  />
                  <button>+</button>
                </form>
              </div>
            </div>
            <SceneComponent
              size={{ width: 3, depth: 3, height: 1 }}
              scale={scale}
            >
              <div
                style={{
                  width: 290,
                  height: scale,
                  backgroundColor: "pink",
                  left: `-98px`,
                  top: `${-furnitureData?.bounds?.height * scale}px`,
                  position: "absolute",
                }}
              ></div>
              {furnitureData?.direction?.[direction]?.textures?.map(
                ({ texture, pivot, zIndex, position }) => (
                  <FurnitureComponent
                    key={texture}
                    sprite={furnitureSprite}
                    sheet={furnitureSheet}
                    frame={texture}
                    scale={scale}
                    pivot={pivot}
                    position={position}
                  />
                ),
              )}
            </SceneComponent>
          </div>
        </div>
      ))}
      <hr />
    </div>
  );
};
