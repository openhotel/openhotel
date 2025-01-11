import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  Event,
  EventMode,
  global,
  graphics,
  GraphicType,
  sprite,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { buttonComponent } from "shared/components";
import { System } from "system";

type Props = {
  title: string;
  description: string;
  label: string;
  onConfirm: () => void;
};

export const confirmModalComponent: ContainerComponent<Props> = (props) => {
  const $container = container({
    visible: true,
  });

  const background = graphics({
    type: GraphicType.RECTANGLE,
    width: 0,
    height: 0,
    tint: 0,
    alpha: 0.75,
    eventMode: EventMode.STATIC,
    withContext: true,
  });
  background.focus();
  const { width, height } = global.getApplication().window.getBounds();
  background.setRectangle(width, height);

  const modal = sprite({
    spriteSheet: SpriteSheetEnum.NAVIGATOR,
    texture: "modal",
  });
  const modalBounds = modal.getBounds();

  const close = graphics({
    type: GraphicType.RECTANGLE,
    width: 16,
    height: 16,
    tint: 0xff00ff,
    eventMode: EventMode.STATIC,
    alpha: 0,
    cursor: Cursor.POINTER,
  });
  close.on(DisplayObjectEvent.POINTER_TAP, () => {
    $container.$destroy();
  });

  const title = textSprite({
    text: props.title.toUpperCase(),
    spriteSheet: SpriteSheetEnum.BOLD_FONT,
    size: {
      width: modalBounds.width - 9,
      height: 7,
    },
    color: 0,
  });

  const description = textSprite({
    text: props.description,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    size: {
      width: modalBounds.width - 24,
      height: modalBounds.height - 100,
    },
    color: 0,
  });

  const confirmButton = buttonComponent({
    text: props.label,
    width: 50,
  });
  confirmButton.on(DisplayObjectEvent.POINTER_TAP, async () => {
    props.onConfirm();
  });

  const cancelButton = buttonComponent({
    text: 'Cancel',
    width: 50,
  });
  cancelButton.on(DisplayObjectEvent.POINTER_TAP, async () => {
    $container.$destroy();
  });

  $container.add(background, modal, close, title, description, confirmButton, cancelButton);

  const $resize = (size: Size) => {
    const { width, height } = size;
    background.setRectangle(width, height);
    modal.setPosition({
      x: Math.abs(modalBounds.width / 2 - width / 2),
      y: Math.abs(modalBounds.height / 2 - height / 2),
    });
    const modalPosition = modal.getPosition();
    close.setPosition({
      x: modalPosition.x + modalBounds.width - 25,
      y: modalPosition.y + 3,
    });
    title.setPosition({
      x: modalPosition.x + 12,
      y: modalPosition.y + 25,
    });
    const titlePosition = title.getPosition();
    description.setPosition({
      x: titlePosition.x,
      y: titlePosition.y + 15,
    });
    confirmButton.setPosition({
      x: modalPosition.x + modalBounds.width - 70,
      y: modalPosition.y + modalBounds.height - 25,
    });
    const confirmButtonPosition = confirmButton.getPosition();
    cancelButton.setPosition({
      x: confirmButtonPosition.x - 70,
      y: confirmButtonPosition.y,
    });
  };

  let $removeOnResize;
  $container.on(DisplayObjectEvent.MOUNT, async (e) => {
    $resize(global.getApplication().window.getBounds());
    $removeOnResize = global.events.on(Event.RESIZE, $resize);
    System.events.emit(SystemEvent.HIDE_MODALS);
  });
  $container.on(DisplayObjectEvent.UNMOUNT, (e) => {
    $removeOnResize();
  });
  return $container.getComponent(confirmModalComponent);
};
