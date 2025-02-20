import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ButtonComponent,
  FileInputComponent,
  InputComponent,
} from "@oh/components";
//@ts-ignore
import styles from "./sprite-sheet-form.module.scss";
import { SpriteSheet, SpriteSheetFrame } from "shared/types";
import { SpriteComponent } from "shared/components";
import { getRandomString, setObject } from "shared/utils";
import { SpriteSheetFrameFormComponent } from "modules/sprite-sheet/sprite-sheet-frame-form";
import { RequestMethod } from "shared/enums";
import { useApi, useAppSession } from "shared/hooks";

type Props = {
  sheet: SpriteSheet;
  sprite: string;

  onChange: (sheet: SpriteSheet, sprite?: string) => void;

  disabled?: boolean;
};

const EMPTY_SPRITE_SHEET_FRAME = {
  frame: {
    frame: {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    },
    sourceSize: { w: 0, h: 0 },
    anchor: {
      x: 0,
      y: 0,
    },
  },
  frameKey: "",
};

export const SpriteSheetFormComponent: React.FC<Props> = ({
  sheet,
  sprite,
  onChange,
  disabled = false,
}) => {
  const { fetch: fetchApi } = useApi();
  const { getHeaders } = useAppSession();

  const $onChange = useCallback(
    (key: string) => (event) => {
      onChange(setObject(sheet, key, event.target.value));
    },
    [onChange, sheet],
  );

  const frameKeys = useMemo(
    () => Object.keys(sheet.frames),
    [sheet.frames, $onChange],
  );

  useEffect(() => {
    for (const frameKey of frameKeys) {
      const frame = sheet.frames[frameKey];
      //@ts-ignore
      if (!frame.__key)
        $onChange(`frames.${frameKey}.__key`)({
          target: { value: getRandomString(4) },
        });
    }
  }, [frameKeys]);

  const $onClickRemoveFrame = useCallback(
    (frameKey: string) => () => {
      const frames = { ...sheet.frames };
      delete frames[frameKey];

      onChange({
        ...sheet,
        frames,
      });
    },
    [sheet, onChange],
  );

  const onUploadSpriteFile = useCallback(
    async ([file]: File[]) => {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await fetchApi({
        pathname: "image/base64",
        method: RequestMethod.POST,
        body: formData,
        headers: getHeaders(),
      });
      onChange(
        {
          ...sheet,
          meta: {
            ...sheet.meta,
            size: {
              w: data.size.width,
              h: data.size.height,
            },
          },
        },
        data.base64,
      );
    },
    [onChange, sheet],
  );

  const [frameDataAdd, setFrameDataAdd] = useState<{
    frame: SpriteSheetFrame | null;
    frameKey: string;
  }>(EMPTY_SPRITE_SHEET_FRAME);

  const $onChangeAdd = useCallback(
    (frame: SpriteSheetFrame, frameKey: string) => {
      setFrameDataAdd({ frame, frameKey });
    },
    [setFrameDataAdd],
  );

  const $onChangeUpdate = useCallback(
    (frame: SpriteSheetFrame, frameKey: string) => {
      onChange({
        ...sheet,
        frames: {
          ...sheet.frames,
          [frameKey]: frame,
        },
      });
    },
    [onChange, sheet],
  );

  const $onAddFrame = useCallback(
    (frame: SpriteSheetFrame, frameKey: string) => {
      if (!frameKey) return;

      onChange({
        ...sheet,
        frames: {
          ...sheet.frames,
          [frameKey]: frame,
        },
      });
      setFrameDataAdd(EMPTY_SPRITE_SHEET_FRAME);
    },
    [onChange, sheet, setFrameDataAdd],
  );
  const $onClickCopyValues = useCallback(
    (frame: SpriteSheetFrame) => {
      setFrameDataAdd({
        frame,
        frameKey: "",
      });
    },
    [setFrameDataAdd],
  );

  return (
    <div className={styles.form}>
      <div className={styles.row}>
        <SpriteComponent spriteSheet={sheet} sprite={sprite} />
        <FileInputComponent onChange={onUploadSpriteFile} accept=".png" />
      </div>
      <hr />
      <div className={styles.column}>
        <div className={styles.row}>
          <InputComponent
            placeholder="meta.image"
            value={sheet.meta.image}
            disabled={disabled}
            onChange={$onChange("meta.image")}
          />
          <InputComponent
            placeholder="meta.format"
            value={sheet.meta.format}
            disabled={disabled}
            onChange={$onChange("meta.format")}
          />
          <InputComponent
            placeholder="meta.scale"
            value={sheet.meta.scale}
            disabled={disabled}
            onChange={$onChange("meta.scale")}
            type="number"
          />
        </div>
        <div className={styles.row}>
          <InputComponent
            placeholder="meta.size.w"
            value={sheet.meta.size.w}
            disabled={disabled}
            onChange={$onChange("meta.size.w")}
            type="number"
          />
          <InputComponent
            placeholder="meta.size.h"
            value={sheet.meta.size.h}
            disabled={disabled}
            onChange={$onChange("meta.size.h")}
            type="number"
          />
        </div>
      </div>
      <hr />
      <div className={styles.list}>
        <label>frames:</label>
        {frameKeys.map((frameKey, index) => {
          const {
            //@ts-ignore
            __key = getRandomString(4),
          } = sheet.frames[frameKey];

          return (
            <SpriteSheetFrameFormComponent
              key={__key}
              sheet={sheet}
              sprite={sprite}
              frameKey={frameKey}
              frame={sheet.frames[frameKey]}
              onChange={$onChangeUpdate}
              type="update"
              onClickRemove={$onClickRemoveFrame(frameKey)}
              onClickCopyValues={$onClickCopyValues}
            />
          );
        })}
        <SpriteSheetFrameFormComponent
          sheet={sheet}
          sprite={sprite}
          type="add"
          frame={frameDataAdd.frame}
          frameKey={frameDataAdd.frameKey}
          onChange={$onChangeAdd}
          onClickAdd={$onAddFrame}
        />
      </div>
    </div>
  );
};
