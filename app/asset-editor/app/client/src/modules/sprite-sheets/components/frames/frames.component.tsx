import React, { FormEvent, useEffect, useRef, useState } from "react";
import {
  SpriteSheet,
  SpriteSheetFrame,
  SpriteSheetRectangle,
} from "shared/types";
import { getColorFromSeed } from "shared/utils";
import styles from "./frames.module.scss";
import { SpriteFrameComponent } from "shared/components/sprite-frame";

type Props = {
  sprite: string;
  sheet: SpriteSheet;
  setSheet: (sheet: SpriteSheet) => void;
  previewRectangle: SpriteSheetRectangle;
};

export const FramesComponent: React.FC<Props> = ({
  sprite,
  sheet,
  setSheet,
  previewRectangle: rectangle,
}) => {
  const nameFrameRef = useRef();

  const [previewRectangle, setPreviewRectangle] =
    useState<SpriteSheetRectangle>(rectangle);

  useEffect(() => {
    setPreviewRectangle(rectangle);
    //@ts-ignore
    nameFrameRef.current.focus();
  }, [rectangle]);

  const onSubmitAddFrame = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const name = data.get("name") as string;

    if (!name) return;

    const frame: SpriteSheetFrame = {
      frame: previewRectangle,
      anchor: { x: 0, y: 0 },
      sourceSize: { w: previewRectangle.w, h: previewRectangle.h },
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
      <form className={styles.frame} onSubmit={onSubmitAddFrame}>
        <input ref={nameFrameRef} name="name" placeholder="name" />
        <input
          name="x"
          value={previewRectangle.x}
          placeholder="x"
          type="number"
          onChange={(event) =>
            setPreviewRectangle((d) => ({
              ...d,
              x: parseInt(event.target.value),
            }))
          }
        />
        <input
          name="y"
          value={previewRectangle.y}
          placeholder="y"
          type="number"
          onChange={(event) =>
            setPreviewRectangle((d) => ({
              ...d,
              y: parseInt(event.target.value),
            }))
          }
        />
        <input
          name="w"
          value={previewRectangle.w}
          placeholder="w"
          type="number"
          onChange={(event) =>
            setPreviewRectangle((d) => ({
              ...d,
              w: parseInt(event.target.value),
            }))
          }
        />
        <input
          name="h"
          value={previewRectangle.h}
          placeholder="h"
          type="number"
          onChange={(event) =>
            setPreviewRectangle((d) => ({
              ...d,
              h: parseInt(event.target.value),
            }))
          }
        />
        <button>+</button>
      </form>
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
          <span>
            <SpriteFrameComponent
              sprite={sprite}
              size={sheet.meta.size}
              frame={frame}
              scale={2}
            />
          </span>
          <button className={styles.action} onClick={onDeleteFrame(frameKey)}>
            delete
          </button>
        </div>
      ))}
    </div>
  );
};
