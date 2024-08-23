import React, { FormEvent, useEffect, useRef } from "react";
import {
  SpriteSheet,
  SpriteSheetFrame,
  SpriteSheetRectangle,
} from "shared/types";
import { getColorFromSeed } from "shared/utils";
import styles from "./frames.module.scss";

type Props = {
  sheet: SpriteSheet;
  setSheet: (sheet: SpriteSheet) => void;
  previewRectangle: SpriteSheetRectangle;
};

export const FramesComponent: React.FC<Props> = ({
  sheet,
  setSheet,
  previewRectangle,
}) => {
  const nameFrameRef = useRef();

  useEffect(() => {
    //@ts-ignore
    nameFrameRef.current.focus();
  }, [previewRectangle]);

  const onSubmitAddFrame = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const name = data.get("name") as string;
    const x = parseInt(data.get("x") as string);
    const y = parseInt(data.get("y") as string);
    const w = parseInt(data.get("w") as string);
    const h = parseInt(data.get("h") as string);

    if (!name) return;

    const frame: SpriteSheetFrame = {
      frame: { x, y, w, h },
      anchor: { x: 0, y: 0 },
      sourceSize: { w, h },
    };

    setSheet({
      ...sheet,
      frames: {
        ...sheet.frames,
        [name]: frame,
      },
    });
    //@ts-ignore
    event.target.reset();
    //@ts-ignore
    nameFrameRef.current.focus();
  };

  const onDeleteFrame = (frameKey: string) => () => {
    const clonedFramesObject = { ...sheet.frames };

    delete clonedFramesObject[frameKey];

    setSheet({
      ...sheet,
      frames: clonedFramesObject,
      animations: Object.keys(sheet.animations).reduce(
        (object, animationKey) => ({
          ...object,
          [animationKey]: sheet.animations[animationKey].filter(
            (frame) => frameKey !== frame,
          ),
        }),
        {},
      ),
    });
  };

  const frames = Object.keys(sheet.frames).map<
    [string, SpriteSheetFrame, string]
  >((frameKey) => [
    frameKey,
    sheet.frames[frameKey],
    getColorFromSeed(frameKey),
  ]);

  return (
    <div className={styles.frames}>
      <span>frames:</span>
      <div className={styles.frame}>
        <label>name</label>
        <span>x</span>
        <span>y</span>
        <span>w</span>
        <span>h</span>
        <label className={styles.action}></label>
      </div>
      {frames.map(([frameKey, { frame }, color]) => (
        <div
          key={frameKey}
          className={styles.frame}
          style={{ backgroundColor: color }}
        >
          <label title={frameKey}>{frameKey}</label>
          <span>{frame.x}</span>
          <span>{frame.y}</span>
          <span>{frame.w}</span>
          <span>{frame.h}</span>
          <button className={styles.action} onClick={onDeleteFrame(frameKey)}>
            delete
          </button>
        </div>
      ))}
      <form className={styles.frame} onSubmit={onSubmitAddFrame}>
        <input ref={nameFrameRef} name="name" placeholder="name" />
        <input
          name="x"
          value={previewRectangle.x}
          placeholder="x"
          type="number"
          defaultValue="0"
        />
        <input
          name="y"
          value={previewRectangle.y}
          placeholder="y"
          type="number"
          defaultValue="0"
        />
        <input
          name="w"
          value={previewRectangle.w}
          placeholder="w"
          type="number"
          defaultValue="0"
        />
        <input
          name="h"
          value={previewRectangle.h}
          placeholder="h"
          type="number"
          defaultValue="0"
        />
        <button>+</button>
      </form>
    </div>
  );
};
