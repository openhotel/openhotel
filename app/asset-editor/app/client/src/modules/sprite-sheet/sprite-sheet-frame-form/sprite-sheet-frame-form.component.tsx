import React, { useCallback } from "react";
import { cn, setObject } from "shared/utils";
import { SpriteComponent } from "shared/components";
import { ButtonComponent, InputComponent } from "@openhotel/web-components";
import { SpriteSheet, SpriteSheetFrame } from "shared/types";

//@ts-ignore
import styles from "./sprite-sheet-frame-form.module.scss";

type Props = {
  sheet: SpriteSheet;
  sprite: string;

  frameKey: string;
  frame: SpriteSheetFrame;

  onChange: (frame: SpriteSheetFrame, frameKey: string) => void;

  type: "add" | "update";

  onClickAdd?: (frame: SpriteSheetFrame, frameKey: string) => void;
  onClickRemove?: (frameKey: string) => void;
  onClickCopyValues?: (frame: SpriteSheetFrame) => void;
};

export const SpriteSheetFrameFormComponent: React.FC<Props> = ({
  sheet,
  sprite,
  frameKey = "",
  frame,
  onChange,
  type = "add",
  onClickAdd,
  onClickRemove,
  onClickCopyValues,
}) => {
  const $onChange = useCallback(
    (key: string) => (event) => {
      onChange(setObject(frame, key, event.target.value), frameKey);
    },
    [onChange, frame, frameKey],
  );

  const $onChangeKey = useCallback(
    (event) => {
      onChange(frame as SpriteSheetFrame, event.target.value);
    },
    [onChange, frame],
  );

  return (
    <div
      className={cn(styles.column, styles.item, {
        [styles.new]: type === "add",
      })}
    >
      <div className={styles.row}>
        <SpriteComponent
          spriteSheet={sheet}
          sprite={sprite}
          frame={frame.frame}
        />
        <InputComponent
          placeholder="name"
          value={frameKey}
          onChange={$onChangeKey}
          disabled={type === "update"}
        />
      </div>
      <div className={styles.row}>
        <InputComponent
          placeholder=".frame.x"
          value={frame.frame.x}
          onChange={$onChange(`frame.x`)}
          type="number"
        />
        <InputComponent
          placeholder=".frame.y"
          value={frame.frame.y}
          onChange={$onChange(`frame.y`)}
          type="number"
        />
        <InputComponent
          placeholder=".frame.w"
          value={frame.frame.w}
          onChange={(event) => {
            $onChange(`frame.w`)(event);
            $onChange(`sourceSize.w`)(event);
          }}
          type="number"
        />
        <InputComponent
          placeholder=".frame.h"
          value={frame.frame.h}
          onChange={(event) => {
            $onChange(`frame.h`)(event);
            $onChange(`sourceSize.h`)(event);
          }}
          type="number"
        />
      </div>
      <div className={styles.row}>
        <InputComponent
          placeholder=".anchor.x"
          value={frame.anchor.x}
          onChange={$onChange(`anchor.x`)}
          type="number"
        />
        <InputComponent
          placeholder=".anchor.y"
          value={frame.anchor.y}
          onChange={$onChange(`anchor.y`)}
          type="number"
        />
        <InputComponent
          placeholder=".sourceSize.w"
          value={frame.sourceSize.w}
          onChange={$onChange(`sourceSize.w`)}
          type="number"
        />
        <InputComponent
          placeholder=".sourceSize.h"
          value={frame.sourceSize.h}
          onChange={$onChange(`sourceSize.h`)}
          type="number"
        />
      </div>
      <div className={styles.row}>
        {type === "add" ? (
          <ButtonComponent
            onClick={() => onClickAdd(frame as SpriteSheetFrame, frameKey)}
          >
            Add
          </ButtonComponent>
        ) : null}
        {type === "update" ? (
          <>
            <ButtonComponent
              color="grey"
              onClick={() => onClickRemove(frameKey)}
            >
              Remove
            </ButtonComponent>
            <ButtonComponent
              color="yellow"
              onClick={() => onClickCopyValues(frame)}
            >
              Copy values
            </ButtonComponent>
          </>
        ) : null}
      </div>
    </div>
  );
};
