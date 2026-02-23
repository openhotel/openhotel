import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
  SelectorComponent,
} from "@openhotel/web-components";
import { cn, setObject } from "shared/utils";
import { SpriteComponent } from "shared/components";
import { FurnitureDirection, FurnitureType } from "shared/enums";
import { useFurniture } from "shared/hooks";
import { FurnitureDirectionItem, FurnitureTexture } from "shared/types";
//@ts-ignore
import styles from "./furniture-data-directions.module.scss";

export const FurnitureDataDirectionsComponent: React.FC = () => {
  const { data, setFurniture, onChangeFurniture } = useFurniture();

  const { furniture, sheet, sprite } = data;

  const [directionSelection, setDirectionSelection] =
    useState<FurnitureDirection>(null);
  const [furnitureDirectionTexture, setFurnitureDirectionTexture] =
    useState<string>(null);

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
            ...furnitureDirection,
            textures: [
              ...(furniture.direction[directionSelection]?.textures ?? []),
              $texture,
            ],
          },
        },
      });
    },
    [
      setFurniture,
      furniture,
      directionSelection,
      furnitureDirectionTexture,
      furnitureDirection,
    ],
  );
  const $onRemoveDirectionTexture = useCallback(
    (index: number) => () => {
      setFurniture({
        ...furniture,
        direction: {
          ...furniture.direction,
          [directionSelection]: {
            ...furnitureDirection,
            textures:
              furniture.direction[directionSelection]?.textures?.filter(
                (_, $index) => index !== $index,
              ) ?? [],
          },
        },
      });
    },
    [setFurniture, furniture, directionSelection, furnitureDirection],
  );

  const actionsOptions = useMemo(
    () =>
      data.furniture.actions.reduce(
        (actionsMap, action) => ({
          ...actionsMap,
          [action.id]: action.states.map((state) => ({
            key: state,
            value: state,
          })),
        }),
        {},
      ),
    [data.furniture.actions],
  );

  return (
    <>
      <label>textures</label>
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
                {furniture.type === FurnitureType.FURNITURE ? (
                  <>
                    <hr />
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
                  </>
                ) : null}
                {data.furniture.actions.length ? (
                  <>
                    <hr />
                    <div className={styles.column}>
                      <div className={styles.column}>
                        {data.furniture.actions.map((action) => (
                          <div key={directionSelection + index + action.id}>
                            <SelectorComponent
                              name={`actions.${action.id}`}
                              placeholder={`.actions.${action.id}`}
                              options={actionsOptions[action.id]}
                              defaultOption={
                                furnitureTexture.actions?.[action.id]
                              }
                              onChange={(option) => {
                                onChangeFurniture(
                                  `direction.${directionSelection}.textures.${index}.actions.${action.id}`,
                                )({ target: { value: option.key } });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
                <hr />
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
              {furniture.type === FurnitureType.FURNITURE ? (
                <>
                  <hr />
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
                </>
              ) : null}
              {data.furniture.actions.length ? (
                <>
                  <hr />
                  <div className={styles.column}>
                    <label>actions</label>
                    <div className={styles.column}>
                      {data.furniture.actions.map((action) => (
                        <div key={action.id}>
                          <SelectorComponent
                            name={`actions.${action.id}`}
                            placeholder={`actions.${action.id}`}
                            options={actionsOptions[action.id]}
                            defaultOption={action.defaultState}
                            clearable={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              <ButtonComponent>Add</ButtonComponent>
            </FormComponent>
          </div>
        </>
      ) : null}
    </>
  );
};
