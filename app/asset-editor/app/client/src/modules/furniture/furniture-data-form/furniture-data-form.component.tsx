import React, { useEffect, useMemo } from "react";
import { InputComponent, SelectorComponent } from "@openhotel/components";
import { FurnitureDirection, FurnitureType } from "shared/enums";
import { SpriteComponent } from "shared/components";
import { useFurniture, useSideContent } from "shared/hooks";
import { FurniturePreviewComponent } from "modules/furniture/furniture-preview";
import { FurnitureDataDirectionsComponent } from "modules/furniture/furniture-data-directions";

//@ts-ignore
import styles from "./furniture-data-form.module.scss";
import { FurnitureDataActionsComponent } from "modules/furniture/furniture-data-actions";
import { FurnitureFramePreviewComponent } from "modules/furniture/furniture-frame-preview";

type Props = {};

export const FurnitureDataFormComponent: React.FC<Props> = () => {
  const { data, onChangeFurniture } = useFurniture();
  const { setComponent } = useSideContent();

  const { furniture, sheet, sprite } = data;

  const textures = useMemo(() => Object.keys(sheet?.frames ?? {}), [sheet]);

  const typeOptions = useMemo(
    () =>
      Object.values(FurnitureType).map(($type) => ({
        key: $type.toLowerCase(),
        value: $type.toLowerCase(),
      })),
    [],
  );

  const texturesOptions = useMemo(
    () =>
      textures.map(($texture) => ({
        key: $texture,
        value: $texture,
      })),
    [textures],
  );

  const isFrame = useMemo(
    () => furniture.type === FurnitureType.FRAME,
    [furniture],
  );
  const isFurniture = useMemo(
    () => furniture.type === FurnitureType.FURNITURE,
    [furniture],
  );

  useEffect(() => {
    setComponent(
      <div className={styles.preview}>
        {isFrame
          ? [FurnitureDirection.NORTH, FurnitureDirection.EAST].map(
              (direction) => (
                <div className={styles.item} key={direction}>
                  <FurnitureFramePreviewComponent direction={direction} />
                  <b>{direction}</b>
                </div>
              ),
            )
          : Object.values(FurnitureDirection).map((direction) => (
              <div className={styles.item} key={direction}>
                <FurniturePreviewComponent direction={direction} />
                <b>{direction}</b>
              </div>
            ))}
      </div>,
    );

    return () => {
      setComponent(null);
    };
  }, [furniture]);

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <InputComponent
          placeholder="id"
          value={furniture.id}
          onChange={onChangeFurniture("id")}
        />
        <InputComponent
          placeholder="version"
          value={furniture.version}
          onChange={onChangeFurniture("version")}
          type="number"
        />
        <SelectorComponent
          placeholder="type"
          defaultOption={furniture.type}
          options={typeOptions}
          onChange={(option) =>
            onChangeFurniture("type")({ target: { value: option?.key } })
          }
          clearable={false}
        />
      </div>
      <hr />
      <div className={styles.row}>
        <SpriteComponent
          sprite={sprite}
          spriteSheet={sheet}
          frame={sheet.frames[furniture.icon.texture]?.frame}
        />
        <SelectorComponent
          placeholder="icon.texture"
          defaultOption={furniture.icon.texture}
          options={texturesOptions}
          onChange={(option) => {
            onChangeFurniture("icon.texture")({
              target: { value: option?.value },
            });
            const frame = sheet.frames[option?.value]?.frame;
            if (!frame) return;

            onChangeFurniture("icon.bounds.width")({
              target: { value: frame.w },
            });

            onChangeFurniture("icon.bounds.height")({
              target: { value: frame.h },
            });
          }}
          clearable={false}
        />
      </div>
      <hr />
      <div className={styles.row}>
        <InputComponent
          placeholder="size.width"
          value={furniture.size?.width || 1}
          onChange={onChangeFurniture("size.width")}
          type="number"
        />
        {isFurniture ? (
          <InputComponent
            placeholder="size.depth"
            value={furniture.size?.depth || 1}
            onChange={onChangeFurniture("size.depth")}
            type="number"
          />
        ) : null}
        <InputComponent
          placeholder="size.height"
          value={furniture.size?.height || 1}
          onChange={onChangeFurniture("size.height")}
          type="number"
        />
      </div>
      <hr />
      <FurnitureDataActionsComponent />
      <hr />
      <FurnitureDataDirectionsComponent />
      <hr />
    </div>
  );
};
