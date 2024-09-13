import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  graphics,
  GraphicType,
  nineSliceSprite,
  sprite,
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { mainTabsComponent } from "./main-tabs.component";
import { System } from "system";

type Props = {
  visible: boolean;
};

export const navigatorModalComponent: ContainerComponent<Props> = (
  { visible } = { visible: false },
) => {
  const $container = container({
    visible,
  });
  const modalHeight = 287;
  const modalWidth = 213;

  const draggable = graphics({
    type: GraphicType.RECTANGLE,
    width: modalWidth,
    height: 21,
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
    width: 20,
    height: 21,
    tint: 0xffffff,
    eventMode: EventMode.STATIC,
    position: {
      x: 180,
      y: 0,
    },
    cursor: Cursor.POINTER,
  });
  close.on(DisplayObjectEvent.POINTER_TAP, () => {
    $container.setVisible(false);
  });
  const base = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "modal-base-rooms",
    leftWidth: 11,
    topHeight: 11,
    rightWidth: 11,
    bottomHeight: 11,
    width: modalWidth,
    height: modalHeight,
  });
  const closeButton = sprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "drag-close",
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
    position: {
      x: modalWidth - 21,
      y: 4,
    },
  });
  closeButton.on(DisplayObjectEvent.POINTER_DOWN, () => {
    $container.setVisible(false);
  });
  const dotsContainer = container({
    position: {
      x: 8,
      y: 4,
    },
    eventMode: EventMode.NONE,
  });
  {
    const dotsWidth = modalWidth / 2 - 15;
    const firstDotsGraphics = sprite({
      spriteSheet: SpriteSheetEnum.UI,
      texture: "drag-1",
      position: {
        x: -4,
        y: 0,
      },
    });
    const secondDotsGraphics = sprite({
      spriteSheet: SpriteSheetEnum.UI,
      texture: "drag-2",
      position: {
        x: -2,
        y: 0,
      },
    });
    const preLastDotsGraphics = sprite({
      spriteSheet: SpriteSheetEnum.UI,
      texture: "drag-2",
      position: {
        x: dotsWidth * 2 + 15,
        y: 0,
      },
    });
    const lastDotsGraphics = sprite({
      spriteSheet: SpriteSheetEnum.UI,
      texture: "drag-1",
      position: {
        x: dotsWidth * 2 + 17,
        y: 0,
      },
    });
    dotsContainer.add(
      firstDotsGraphics,
      secondDotsGraphics,
      preLastDotsGraphics,
      lastDotsGraphics,
    );
    for (let i = 0; i < dotsWidth; i++) {
      const dotsGraphics = sprite({
        spriteSheet: SpriteSheetEnum.UI,
        texture: "drag-3",
        position: {
          x: i * 2,
          y: 0,
        },
      });
      dotsContainer.add(dotsGraphics);
    }
  }

  const $mainTabs = mainTabsComponent();

  const $backgroundModal = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "modal-1-selected",
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width: 201,
    height: modalHeight - 60,
    position: {
      x: 6,
      y: 50,
    },
    cursor: Cursor.DEFAULT,
  });

  $container.add(
    base,
    draggable,
    $backgroundModal,
    $mainTabs,
    dotsContainer,
    closeButton,
  );

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
