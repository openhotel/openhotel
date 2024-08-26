import React, { FormEvent, useEffect, useState } from "react";
import { ContainerComponent } from "shared/components";
import { useFurniture, useSpriteSheets } from "shared/hooks";
import { FurnitureItemComponent } from "./components";
import styles from "./furniture.module.scss";
import { SelectComponent } from "shared/components/select";

export const FurnitureComponent: React.FC = () => {
  const { getList: getSpriteSheetList } = useSpriteSheets();
  const { getList, create, remove } = useFurniture();

  const [spriteSheetList, setSpriteSheetList] = useState<string[]>([]);

  const [furnitureList, setFurnitureList] = useState<string[]>([]);
  const [selectedFurniture, setSelectedFurniture] = useState<string>("");

  const reload = () => {
    getList().then(setFurnitureList);
    getSpriteSheetList().then(setSpriteSheetList);
  };

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    const spriteSheet = localStorage.getItem("furniture");
    if (spriteSheet !== null) setSelectedFurniture(spriteSheet);
  }, []);

  useEffect(() => {
    selectedFurniture
      ? localStorage.setItem("furniture", selectedFurniture)
      : localStorage.removeItem("furniture");
  }, [selectedFurniture]);

  const onSubmitAddFurniture = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const id = data.get("id") as string;

    if (!id || furnitureList.includes(id)) return;

    await create(id);
    //@ts-ignore
    event.target.reset();
    await reload();
    setSelectedFurniture(id);
  };

  const onDelete = async () => {
    await remove(selectedFurniture);
    await reload();
    setSelectedFurniture("");
  };

  const onClose = () => {
    setSelectedFurniture("");
  };

  console.log(selectedFurniture);
  return (
    <ContainerComponent className={styles.container}>
      <div className={styles.actions}>
        <SelectComponent
          list={["", ...furnitureList]}
          onChange={setSelectedFurniture}
          value={selectedFurniture}
        />
        <form className={styles.new} onSubmit={onSubmitAddFurniture}>
          <SelectComponent
            name="id"
            list={[
              "",
              ...spriteSheetList.filter(
                (spriteSheetId) => !furnitureList.includes(spriteSheetId),
              ),
            ]}
          />
          <button>+</button>
        </form>
      </div>
      <hr />
      <div className={styles.content}>
        {selectedFurniture && furnitureList.length ? (
          <FurnitureItemComponent
            furnitureId={selectedFurniture}
            onClose={onClose}
            onDelete={onDelete}
          />
        ) : null}
      </div>
    </ContainerComponent>
  );
};
