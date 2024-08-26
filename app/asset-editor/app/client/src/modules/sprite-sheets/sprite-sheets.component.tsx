import React, { FormEvent, useEffect, useState } from "react";
import { ContainerComponent } from "shared/components";
import { useSpriteSheets } from "shared/hooks";
import { SpriteSheetComponent } from "./components";
import styles from "./sprite-sheets.module.scss";
import { SelectComponent } from "shared/components/select";

export const SpriteSheetsComponent: React.FC = () => {
  const { getList, create, remove } = useSpriteSheets();

  const [spriteSheets, setSpriteSheets] = useState<string[]>([]);
  const [selectedSpriteSheet, setSelectedSpriteSheet] = useState<string>("");

  const reload = () => getList().then(setSpriteSheets);

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    const spriteSheet = localStorage.getItem("sprite-sheet");
    if (spriteSheet !== null) setSelectedSpriteSheet(spriteSheet);
  }, []);

  useEffect(() => {
    selectedSpriteSheet
      ? localStorage.setItem("sprite-sheet", selectedSpriteSheet)
      : localStorage.removeItem("sprite-sheet");
  }, [selectedSpriteSheet]);

  const onSubmitAddSpriteSheet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const name = data.get("name") as string;

    if (!name.length || spriteSheets.includes(name)) return;

    await create(name);
    //@ts-ignore
    event.target.reset();
    await reload();
    setSelectedSpriteSheet(name);
  };

  const onDelete = async () => {
    await remove(selectedSpriteSheet);
    await reload();
    setSelectedSpriteSheet("");
  };

  const onClose = async () => {
    setSelectedSpriteSheet("");
  };

  return (
    <ContainerComponent className={styles.container}>
      <div className={styles.actions}>
        <SelectComponent
          list={["", ...spriteSheets]}
          onChange={setSelectedSpriteSheet}
          value={selectedSpriteSheet}
        />
        <form className={styles.new} onSubmit={onSubmitAddSpriteSheet}>
          <input name="name" placeholder="sprite-sheet name" />
          <button>+</button>
        </form>
      </div>
      <hr />
      <div className={styles.content}>
        {selectedSpriteSheet && spriteSheets.length ? (
          <SpriteSheetComponent
            id={selectedSpriteSheet}
            onDelete={onDelete}
            onClose={onClose}
          />
        ) : null}
      </div>
      <hr />
    </ContainerComponent>
  );
};
