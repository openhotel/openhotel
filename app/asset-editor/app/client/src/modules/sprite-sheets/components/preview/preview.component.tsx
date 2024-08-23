import React, { useEffect, useState } from "react";
import styles from "./preview.module.scss";
import {
  SpriteSheet,
  SpriteSheetFrame,
  SpriteSheetPoint,
  SpriteSheetRectangle,
} from "shared/types";
import { getColorFromSeed } from "shared/utils";

type Props = {
  sheet: SpriteSheet;
  sprite: string;

  onChangePreviewRectangle: (rectangle: SpriteSheetRectangle) => void;
};

const PREVIEW_PADDING = 10;

export const PreviewComponent: React.FC<Props> = ({
  sheet,
  sprite,
  onChangePreviewRectangle,
}) => {
  const [previewScale, setPreviewScale] = useState<number>(6);

  const [firstPoint, setFirstPoint] = useState<SpriteSheetPoint>({
    x: 0,
    y: 0,
  });
  const [secondPoint, setSecondPoint] = useState<SpriteSheetPoint>({
    x: 0,
    y: 0,
  });
  const [previewPoint, setPreviewPoint] = useState<SpriteSheetPoint>({
    x: 0,
    y: 0,
  });

  const previewRectangle: SpriteSheetRectangle = {
    x: firstPoint.x,
    y: firstPoint.y,
    w: secondPoint.x - firstPoint.x,
    h: secondPoint.y - firstPoint.y,
  };

  useEffect(() => {
    onChangePreviewRectangle(previewRectangle);
  }, [firstPoint, secondPoint]);

  const getPoint = (event) => {
    const clientRect = event.target.getBoundingClientRect();
    return {
      x: Math.round(
        (event.clientX - clientRect.left - PREVIEW_PADDING) / previewScale,
      ),
      y: Math.round(
        (event.clientY - clientRect.top - PREVIEW_PADDING) / previewScale,
      ),
    };
  };

  const onMouseMoveSprite = (event) => {
    setPreviewPoint(getPoint(event));
  };
  const onClickSprite = (event) => {
    setFirstPoint(getPoint(event));
  };
  const onContextMenu = (event) => {
    event.preventDefault();
    setSecondPoint(getPoint(event));
  };

  const onAddScale = () => {
    setPreviewScale((scale) => scale + 1);
  };

  const onSubScale = () => {
    setPreviewScale((scale) => (scale === 0 ? 0 : scale - 1));
  };

  const frames = Object.keys(sheet.frames).map<
    [string, SpriteSheetFrame, string]
  >((frameKey) => [
    frameKey,
    sheet.frames[frameKey],
    getColorFromSeed(frameKey),
  ]);

  const imageSize = sheet.meta.size;

  const clickPointPreview = {
    x: firstPoint.x * previewScale,
    y: firstPoint.y * previewScale,
  };

  return (
    <div className={styles.preview}>
      <div className={styles.imageWrap}>
        <div
          className={styles.image}
          style={{
            width: imageSize.w * previewScale,
            height: imageSize.h * previewScale,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: secondPoint.x * previewScale - clickPointPreview.x,
              height: secondPoint.y * previewScale - clickPointPreview.y,
              left: clickPointPreview.x,
              top: clickPointPreview.y,
              backgroundColor: "#00ff00",
              opacity: 0.5,
              zIndex: 10,
            }}
          ></div>
          {frames.map(([frameKey, { frame }, color]) => (
            <div
              key={frameKey}
              style={{
                position: "absolute",
                left: frame.x * previewScale,
                top: frame.y * previewScale,
                height: frame.h * previewScale,
                width: frame.w * previewScale,
                backgroundColor: color,
                opacity: 0.6,
              }}
            />
          ))}
          <div
            onMouseMove={onMouseMoveSprite}
            onClick={onClickSprite}
            onContextMenu={onContextMenu}
            style={{
              position: "absolute",
              left: -PREVIEW_PADDING,
              top: -PREVIEW_PADDING,
              width: imageSize.w * previewScale + PREVIEW_PADDING * 2,
              height: imageSize.h * previewScale + PREVIEW_PADDING * 2,
              opacity: 0,
              backgroundColor: "red",
              zIndex: 20,
            }}
          />
          <img
            alt=""
            src={sprite}
            style={{
              width: imageSize.w * previewScale,
              height: imageSize.h * previewScale,
            }}
          />
        </div>
      </div>
      <div className={styles.coords}>
        <div className={styles.scale}>
          <label>w: {imageSize.w}</label>
          <label>h: {imageSize.h}</label>
        </div>
        <hr />
        <div className={styles.scale}>
          <label>scale: {previewScale}</label>
          <button onClick={onAddScale}>+</button>
          <button onClick={onSubScale}>-</button>
        </div>
        <hr />
        <div className={styles.absolute}>
          <span>x:{previewPoint.x}</span>
          <span>y:{previewPoint.y}</span>
        </div>
        <div className={styles.relative}>
          <span>x:{previewRectangle.x}</span>
          <span>y:{previewRectangle.y}</span>
          <span>-</span>
          <span>w:{previewRectangle.w}</span>
          <span>h:{previewRectangle.h}</span>
        </div>
      </div>
    </div>
  );
};
