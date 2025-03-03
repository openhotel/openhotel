import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  Event,
  EventMode,
  global,
  nineSliceSprite,
  sprite,
  Size,
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";

type ModalProps = {
  width?: number;
  height?: number;
  padding?: number;
  onClose?: () => void;
};
type ModalMutable = {
  addContent: () => void;
  getContentSize: () => Size;
};

export const modalComponent: ContainerComponent<ModalProps, ModalMutable> = ({
  visible = false,
  width = 300,
  height = 200,
  padding = 12,
  onClose = () => {},
} = {}) => {
  const $container = container<ModalProps, ModalMutable>({
    visible,
    sortableChildren: true,
    eventMode: EventMode.STATIC,
  });

  const $base = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "modal-base-rooms",
    leftWidth: 11,
    topHeight: 11,
    rightWidth: 11,
    bottomHeight: 11,
    width,
    height,
  });
  $container.add($base);

  const baseSize = $base.getBounds();

  const $close = sprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "drag-close",
    position: {
      x: baseSize.width - 25,
      y: 3,
    },
    cursor: Cursor.POINTER,
    eventMode: EventMode.STATIC,
  });
  $close.on(DisplayObjectEvent.POINTER_TAP, () => {
    $container.setVisible(false);
    onClose();
  });

  const $draggable = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "drag",
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width: baseSize.width - 25 - 8,
    height: 13,
    position: {
      x: 4,
      y: 3,
    },
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
    metadata: "draggable",
  });

  $container.add($draggable, $close);

  const $content = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "modal-1-selected",
    leftWidth: 11,
    topHeight: 11,
    rightWidth: 11,
    bottomHeight: 11,
    width: baseSize.width - padding,
    height: baseSize.height - $draggable.getBounds().height - padding,
    position: {
      x: padding / 2,
      y: $draggable.getBounds().height + padding / 2,
    },
  });
  $container.add($content);

  let removeOnPointerDown: Function;
  let removeOnPointerUp: Function;

  $container.on(DisplayObjectEvent.ADDED, async () => {
    removeOnPointerDown = $container.on(DisplayObjectEvent.POINTER_DOWN, () => {
      System.events.emit(SystemEvent.DISABLE_CAMERA_MOVEMENT);
    });

    removeOnPointerUp = global.events.on(Event.POINTER_UP, () => {
      System.events.emit(SystemEvent.ENABLE_CAMERA_MOVEMENT);
    });
  });

  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnPointerDown?.();
    removeOnPointerUp?.();
  });

  return $container.getComponent(modalComponent, {
    add: $container.add,
    getContentSize: () => {
      const $contentSize = $content.getBounds();
      return {
        width: $contentSize.width - padding,
        height: $contentSize.height - padding,
      };
    },
  });
};
