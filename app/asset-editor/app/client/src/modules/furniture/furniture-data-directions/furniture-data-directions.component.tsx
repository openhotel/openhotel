import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectorComponent,
} from "@openhotel/components";
import { cn, setObject } from "shared/utils";
import { SpriteComponent } from "shared/components";
import { FurnitureDirection, FurnitureType } from "shared/enums";
import { useFurniture } from "shared/hooks";
import {
  FurnitureBounds,
  FurnitureDirectionItem,
  FurnitureTexture,
} from "shared/types";
//@ts-ignore
import styles from "./furniture-data-directions.module.scss";

export const FurnitureDataDirectionsComponent: React.FC = () => {
  const { data, setFurniture, onChangeFurniture } = useFurniture();

  const { furniture, sheet, sprite } = data;

  const [directionSelection, setDirectionSelection] =
    useState<FurnitureDirection>(null);
  const [furnitureDirectionTexture, setFurnitureDirectionTexture] =
    useState<string>(null);

  const [previewBounds, setPreviewBounds] = useState<FurnitureBounds>({
    width: 0,
    height: 0,
  });

  const textures = useMemo(() => Object.keys(sheet?.frames ?? {}), [sheet]);

  const directions = useMemo(
    () =>
      furniture.type === FurnitureType.FURNITURE
        ? Object.values(FurnitureDirection)
        : [FurnitureDirection.NORTH, FurnitureDirection.EAST],
    [furniture.type],
  );
  const directionsOptions = useMemo(
    () =>
      directions.map(($direction) => ({
        key: $direction,
        value: $direction,
      })),
    [directions, furniture],
  );

  const furnitureDirection = useMemo(
    () => furniture?.direction[directionSelection] || {},
    [furniture, directionSelection],
  ) as FurnitureDirectionItem;

  const texturesOptions = useMemo(
    () =>
      textures.map(($texture) => ({
        key: $texture,
        value: $texture,
      })),
    [textures],
  );

  useEffect(() => {
    //change to default every time textures change
    setFurnitureDirectionTexture(
      texturesOptions[0] ? texturesOptions[0].key : null,
    );
  }, [texturesOptions]);

  useEffect(() => {
    const data = sheet.frames[furnitureDirectionTexture];
    setPreviewBounds({
      width: data?.frame?.w ?? 0,
      height: data?.frame?.h ?? 0,
    });
  }, [furnitureDirectionTexture]);

  const $onAddDirectionTexture = useCallback(
    (data) => {
      //@ts-ignore
      let $texture: FurnitureTexture = {};
      for (const key of Object.keys(data))
        $texture = setObject($texture, key, data[key]);

      $texture.texture = furnitureDirectionTexture;

      setFurniture({
        ...furniture,
        direction: {
          ...furniture.direction,
          [directionSelection]: {
            textures: [
              ...(furniture.direction[directionSelection]?.textures ?? []),
              $texture,
            ],
          },
        },
      });
    },
    [setFurniture, furniture, directionSelection, furnitureDirectionTexture],
  );
  const $onRemoveDirectionTexture = useCallback(
    (index: number) => () => {
      setFurniture({
        ...furniture,
        direction: {
          ...furniture.direction,
          [directionSelection]: {
            textures:
              furniture.direction[directionSelection]?.textures?.filter(
                (_, $index) => index !== $index,
              ) ?? [],
          },
        },
      });
    },
    [setFurniture, furniture, directionSelection],
  );

  return (
    <>
      <SelectorComponent
        placeholder="direction"
        className={styles.alternativeSelector}
        options={directionsOptions}
        defaultOption={directionSelection}
        onChange={(option) => setDirectionSelection(option?.key ?? null)}
      />
      {directionSelection ? (
        <>
          <div className={styles.list}>
            {furnitureDirection?.textures?.map((furnitureTexture, index) => (
              <div
                key={directionSelection + index}
                className={cn(styles.column, styles.item)}
              >
                <label>
                  direction.{directionSelection}.[{index}]
                </label>
                <div className={styles.row}>
                  <SpriteComponent
                    sprite={sprite}
                    spriteSheet={sheet}
                    frame={sheet.frames[furnitureTexture.texture]?.frame}
                  />
                  <SelectorComponent
                    placeholder={`.texture`}
                    defaultOption={furnitureTexture.texture}
                    options={texturesOptions}
                    onChange={(option) => {
                      onChangeFurniture(
                        `direction.${directionSelection}.textures.${index}.texture`,
                      )({
                        target: { value: option?.key },
                      });
                      const { w, h } =
                        sheet.frames[furnitureTexture.texture].frame;
                      onChangeFurniture(
                        `direction.${directionSelection}.textures.${index}.bounds.width`,
                      )({
                        target: { value: w },
                      });
                      onChangeFurniture(
                        `direction.${directionSelection}.textures.${index}.bounds.height`,
                      )({
                        target: { value: h },
                      });
                    }}
                    clearable={false}
                  />
                  <InputComponent
                    placeholder={`.zIndex`}
                    value={furnitureTexture.zIndex}
                    onChange={onChangeFurniture(
                      `direction.${directionSelection}.textures.${index}.zIndex`,
                    )}
                    type="number"
                  />
                </div>
                <hr />
                <div className={styles.row}>
                  <InputComponent
                    placeholder={`.bounds.width`}
                    value={furnitureTexture?.bounds?.width}
                    onChange={onChangeFurniture(
                      `direction.${directionSelection}.textures.${index}.bounds.width`,
                    )}
                    type="number"
                  />
                  <InputComponent
                    placeholder={`.bounds.height`}
                    value={furnitureTexture?.bounds?.height}
                    onChange={onChangeFurniture(
                      `direction.${directionSelection}.textures.${index}.bounds.height`,
                    )}
                    type="number"
                  />
                </div>
                <hr />
                <div className={styles.row}>
                  <InputComponent
                    placeholder={`.pivot.x`}
                    value={furnitureTexture?.pivot?.x}
                    onChange={onChangeFurniture(
                      `direction.${directionSelection}.textures.${index}.pivot.x`,
                    )}
                    type="number"
                  />
                  <InputComponent
                    placeholder={`.pivot.y`}
                    value={furnitureTexture?.pivot?.y}
                    onChange={onChangeFurniture(
                      `direction.${directionSelection}.textures.${index}.pivot.y`,
                    )}
                    type="number"
                  />
                </div>
                <hr />
                {furniture.type === FurnitureType.FURNITURE ? (
                  <div className={styles.row}>
                    <InputComponent
                      placeholder={`.position.x`}
                      value={furnitureTexture?.position?.x}
                      onChange={onChangeFurniture(
                        `direction.${directionSelection}.textures.${index}.position.x`,
                      )}
                      type="number"
                    />
                    <InputComponent
                      placeholder={`.position.z`}
                      value={furnitureTexture?.position?.z}
                      onChange={onChangeFurniture(
                        `direction.${directionSelection}.textures.${index}.position.z`,
                      )}
                      type="number"
                    />
                  </div>
                ) : null}
                <ButtonComponent
                  color="grey"
                  onClick={$onRemoveDirectionTexture(index)}
                >
                  Remove
                </ButtonComponent>
              </div>
            ))}
            <FormComponent
              onSubmit={$onAddDirectionTexture}
              className={cn(styles.column, styles.item, styles.new)}
            >
              <label>
                direction.{directionSelection}.[
                {furnitureDirection?.textures?.length ?? 0}]
              </label>
              <div className={styles.row}>
                <SpriteComponent
                  sprite={sprite}
                  spriteSheet={sheet}
                  frame={sheet.frames[furnitureDirectionTexture]?.frame}
                />
                <SelectorComponent
                  name="texture"
                  placeholder={`texture`}
                  options={texturesOptions}
                  defaultOption={furnitureDirectionTexture}
                  onChange={(option) =>
                    setFurnitureDirectionTexture(option?.key)
                  }
                  clearable={false}
                />
                <InputComponent
                  name="zIndex"
                  placeholder={`zIndex`}
                  type="number"
                  defaultValue={0}
                />
              </div>
              <hr />
              <div className={styles.row}>
                <InputComponent
                  name="bounds.width"
                  placeholder={`bounds.width`}
                  type="number"
                  value={previewBounds.width}
                  onChange={(event) =>
                    setPreviewBounds((bounds) => ({
                      ...bounds,
                      width: event.target.value,
                    }))
                  }
                />
                <InputComponent
                  name="bounds.height"
                  placeholder={`bounds.height`}
                  type="number"
                  value={previewBounds.height}
                  onChange={(event) =>
                    setPreviewBounds((bounds) => ({
                      ...bounds,
                      height: event.target.value,
                    }))
                  }
                />
              </div>
              <hr />
              <div className={styles.row}>
                <InputComponent
                  name="pivot.x"
                  placeholder={`pivot.x`}
                  type="number"
                  defaultValue={0}
                />
                <InputComponent
                  name="pivot.y"
                  placeholder={`pivot.y`}
                  type="number"
                  defaultValue={0}
                />
              </div>
              <hr />
              {furniture.type === FurnitureType.FURNITURE ? (
                <div className={styles.row}>
                  <InputComponent
                    name="position.x"
                    placeholder={`position.x`}
                    type="number"
                    defaultValue={0}
                  />
                  <InputComponent
                    name="position.y"
                    placeholder={`position.z`}
                    type="number"
                    defaultValue={0}
                  />
                </div>
              ) : null}
              <ButtonComponent>Add</ButtonComponent>
            </FormComponent>
          </div>
        </>
      ) : null}
    </>
  );
};
