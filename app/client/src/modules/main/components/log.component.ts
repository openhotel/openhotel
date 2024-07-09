import { container, ContainerComponent, textSprite } from "@tulib/tulip";

type Mutable = {
  setLog: (text: string) => void;
};

export const logComponent: ContainerComponent<{}, Mutable> = async () => {
  const $container = await container<{}, Mutable>();

  const tagName = await textSprite({
    text: "",
    spriteSheet: "default-font.json",
    position: {
      x: 20,
      y: 100,
    },
  });
  $container.add(tagName);

  return $container.getComponent(logComponent, {
    setLog: (text) => {
      tagName.setText(text);
    },
  });
};
