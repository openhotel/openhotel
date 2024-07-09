import { container, ContainerComponent, textSprite } from "@tulib/tulip";

type Mutable = {
  addLog: (text: string) => void;
};

export const logComponent: ContainerComponent<{}, Mutable> = async () => {
  const $container = await container<{}, Mutable>();
  await $container.setPosition({
    x: 20,
    y: 100,
  });

  return $container.getComponent(logComponent, {
    addLog: async (text) => {
      const children = $container.getChildren();
      for (let i = 0; i < children.length; i++) {
        await children[i].setPositionY((i + 1) * 8);
      }
      const tagName = await textSprite({
        text,
        spriteSheet: "default-font.json",
      });
      $container.add(tagName);
    },
  });
};
