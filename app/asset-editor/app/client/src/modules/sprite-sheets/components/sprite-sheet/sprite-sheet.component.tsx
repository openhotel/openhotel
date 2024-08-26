import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { SpriteSheet, SpriteSheetRectangle } from "shared/types";
import { useSpriteSheets } from "shared/hooks";
import styles from "./sprite-sheet.module.scss";
import { FramesComponent } from "../frames";
import { AnimationsComponent } from "../animations";
import { PreviewComponent } from "modules/sprite-sheets/components/preview/preview.component";

type Props = {
  id: string;
  onDelete: () => void;
  onClose: (id: string) => void;
};

export const SpriteSheetComponent: React.FC<Props> = ({
  id,
  onDelete,
  onClose,
}) => {
  const { getSprite, getSheet, updateSheet, uploadSheet, uploadSprite } =
    useSpriteSheets();
  const uploadSpriteRef = useRef();
  const uploadSheetRef = useRef();

  const [sprite, setSprite] = useState<string>();
  const [sheet, setSheet] = useState<SpriteSheet>();

  const [previewRectangle, setPreviewRectangle] =
    useState<SpriteSheetRectangle>({ x: 0, y: 0, w: 0, h: 0 });

  const $reload = () => {
    getSprite(id).then(setSprite).catch(onClose);
    getSheet(id).then(setSheet).catch(onClose);
  };

  useEffect(() => {
    if (!id) {
      setSprite(null);
      setSheet(null);
      return;
    }

    $reload();
  }, [id]);

  const onUploadSprite = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    await uploadSprite(id, files);
    //@ts-ignore
    uploadSpriteRef.current.value = "";
    $reload();
  };

  const onUploadSheet = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    await uploadSheet(id, files);
    //@ts-ignore
    uploadSheetRef.current.value = "";
    $reload();
  };

  useEffect(() => {
    if (!sheet) return;
    updateSheet(id, sheet);
  }, [sheet]);

  const setAnimations = (animations: Record<string, string[]>) => {
    setSheet({
      ...sheet,
      animations,
    });
  };

  if (!sheet || !sprite) return <div />;

  const frames = Object.keys(sheet.frames);
  const imageSize = sheet.meta.size;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.actions}>
          <button>
            <label htmlFor="uploadSheet">Import Sheet</label>
          </button>
          <input
            id="uploadSheet"
            hidden
            ref={uploadSheetRef}
            type="file"
            multiple
            onChange={onUploadSheet}
          />
          <button>
            <label htmlFor="uploadSprite">Import Sprite</label>
          </button>
          <input
            id="uploadSprite"
            hidden
            ref={uploadSpriteRef}
            type="file"
            multiple
            onChange={onUploadSprite}
          />
          <button className={styles.delete} onClick={onDelete}>
            delete
          </button>
        </div>
        <hr />
        <PreviewComponent
          sheet={sheet}
          sprite={sprite}
          onChangePreviewRectangle={setPreviewRectangle}
        />
      </div>
      <hr />
      <FramesComponent
        sprite={sprite}
        sheet={sheet}
        setSheet={setSheet}
        previewRectangle={previewRectangle}
      />
      <hr />
      <AnimationsComponent
        frames={frames}
        animations={sheet.animations}
        setAnimations={setAnimations}
      />
    </div>
  );
};
