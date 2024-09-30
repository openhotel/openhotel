import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  graphics,
  GraphicType,
  sprite,
} from "@tu/tulip";
import { NavigatorCategory, SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";
import { NAVIGATOR_CATEGORY_SPRITE_MAP } from "shared/consts";
import { publicRoomsComponent } from "./public-rooms.component";
import { privateRoomsComponent } from "./private-rooms.component";
import { topRoomsComponent } from "./top-rooms.component";
import { likedRoomsComponent } from "./liked-rooms.component";
import { ownRoomsComponent } from "./own-rooms.component";

type Props = {
  visible: boolean;
};

export const navigatorModalComponent: ContainerComponent<Props> = (
  { visible } = { visible: false },
) => {
  const $container = container({
    visible,
    sortableChildren: true,
  });
  const base = sprite({
    spriteSheet: SpriteSheetEnum.NAVIGATOR,
    texture: "modal",
  });
  $container.add(base);

  const draggable = graphics({
    type: GraphicType.RECTANGLE,
    width: base.getBounds().width,
    height: 20,
    tint: 0xff00ff,
    eventMode: EventMode.STATIC,
    position: {
      x: 0,
      y: 0,
    },
    metadata: "draggable",
    alpha: 0,
  });
  const close = graphics({
    type: GraphicType.RECTANGLE,
    width: 16,
    height: 16,
    tint: 0xff00ff,
    eventMode: EventMode.STATIC,
    position: {
      x: base.getBounds().width - 25,
      y: 3,
    },
    alpha: 0,
    cursor: Cursor.POINTER,
  });
  close.on(DisplayObjectEvent.POINTER_TAP, () => {
    $container.setVisible(false);
  });
  $container.add(draggable, close);

  const content = sprite({
    spriteSheet: SpriteSheetEnum.NAVIGATOR,
    texture: "content",
    position: {
      x: 37,
      y: 20,
    },
    zIndex: 10,
  });
  $container.add(content);

  const $contentSize = content.getBounds();
  const contentSize = {
    width: $contentSize.width - 12,
    height: $contentSize.height - 12,
  };

  const categoryComponentMap: Record<NavigatorCategory, any> = {
    [NavigatorCategory.PUBLIC]: publicRoomsComponent(),
    [NavigatorCategory.PRIVATE]: privateRoomsComponent({ size: contentSize }),
    [NavigatorCategory.TOP]: topRoomsComponent(),
    [NavigatorCategory.LIKED]: likedRoomsComponent(),
    [NavigatorCategory.OWN]: ownRoomsComponent(),
  };

  const $content = container({
    position: {
      x: 43,
      y: 26,
    },
    zIndex: 20,
  });
  $container.add($content);

  let selectedCategory: NavigatorCategory = NavigatorCategory.PRIVATE;
  $content.add(categoryComponentMap[selectedCategory]);

  const selectionTabItem = sprite({
    spriteSheet: SpriteSheetEnum.NAVIGATOR,
    texture: (selectedCategory as number) === 0 ? "selector-top" : "selector",
    position: {
      x: 6,
      y: 20 + selectedCategory * 26,
    },
    zIndex: 11,
  });
  $container.add(selectionTabItem);
  for (
    let categoryIndex = 0;
    categoryIndex < Object.keys(NAVIGATOR_CATEGORY_SPRITE_MAP).length;
    categoryIndex++
  ) {
    const texture = NAVIGATOR_CATEGORY_SPRITE_MAP[categoryIndex];
    const tabItem = sprite({
      spriteSheet: SpriteSheetEnum.NAVIGATOR,
      texture: "selector-disabled",
      position: {
        x: 6,
        y: 20 + categoryIndex * 26,
      },
      zIndex: 9,
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
    });
    tabItem.on(DisplayObjectEvent.POINTER_TAP, () => {
      selectionTabItem.setPositionY(20 + categoryIndex * 26);
      selectionTabItem.setTexture(
        categoryIndex === 0 ? "selector-top" : "selector",
        SpriteSheetEnum.NAVIGATOR,
      );

      $content.remove(categoryComponentMap[selectedCategory]);
      selectedCategory = categoryIndex;
      $content.add(categoryComponentMap[selectedCategory]);
    });
    const tabItemTexture = sprite({
      spriteSheet: SpriteSheetEnum.NAVIGATOR,
      texture,
      position: {
        x: 12,
        y: 23 + categoryIndex * 26,
      },
      zIndex: 12,
      eventMode: EventMode.NONE,
    });
    $container.add(tabItem, tabItemTexture);
  }

  let removeOnShowNavigatorModal;
  let removeOnHideNavigatorModal;
  let removeOnToggleNavigatorModal;

  $container.on(DisplayObjectEvent.ADDED, () => {
    removeOnToggleNavigatorModal = System.events.on(
      SystemEvent.TOGGLE_NAVIGATOR_MODAL,
      () => {
        $container.setVisible((visible) => !visible);
      },
    );
    removeOnShowNavigatorModal = System.events.on(
      SystemEvent.SHOW_NAVIGATOR_MODAL,
      () => {
        $container.setVisible(true);
      },
    );
    removeOnHideNavigatorModal = System.events.on(
      SystemEvent.HIDE_NAVIGATOR_MODAL,
      () => {
        $container.setVisible(false);
      },
    );
  });

  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnShowNavigatorModal();
    removeOnHideNavigatorModal();
    removeOnToggleNavigatorModal();
  });

  return $container.getComponent(navigatorModalComponent);
};
