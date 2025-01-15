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
  $container.add(background);
  const { width, height } = global.getApplication().window.getBounds();
  background.setRectangle(width, height);

  const $card = container({
    position: {
      x: width / 2,
      y: height / 2,
    },
  });

  const modal = sprite({
    spriteSheet: SpriteSheetEnum.CONFIRMATION_MODAL,
    texture: "modal",
  });

  $card.setPivotX(modal.getBounds().width / 2);
  $card.setPivotY(modal.getBounds().height / 2);
  $container.add($card);


  const close = graphics({
    type: GraphicType.RECTANGLE,
    width: 14,
    height: 14,
    tint: 0xff00ff,
    eventMode: EventMode.STATIC,
    alpha: 0,
    cursor: Cursor.POINTER,
    position: {
      x: modal.getBounds().width - 25,
      y: 3,
    },
  });
  close.on(DisplayObjectEvent.POINTER_TAP, () => {
    $container.$destroy();
  });

  const title = textSprite({
    text: props.title.toUpperCase(),
    spriteSheet: SpriteSheetEnum.BOLD_FONT,
    position: {
      x: 12,
      y: 8
    },
    size: {
      width: modal.getBounds().width - 25,
      height: 7,
    },
    color: 0,
  });

  const description = textSprite({
    text: props.description,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    position: {
      x: 12,
      y: 30,
    },
    size: {
      width: modal.getBounds().width - 25,
      height: modal.getBounds().height - 80,
    },
    color: 0,
  });

  const confirm = graphics({
    type: GraphicType.RECTANGLE,
    width: 40,
    height: 30,
    tint: 0xff00ff,
    eventMode: EventMode.STATIC,
    alpha: 0,
    cursor: Cursor.POINTER,
    position: {
      x: modal.getBounds().width - 50,
      y: modal.getBounds().height - 40,
    },
  });
  confirm.on(DisplayObjectEvent.POINTER_TAP, async () => {
     props.onConfirm();
   });

  const cancel = graphics({
    type: GraphicType.RECTANGLE,
    width: 40,
    height: 30,
    tint: 0xff00ff,
    eventMode: EventMode.STATIC,
    alpha: 0,
    cursor: Cursor.POINTER,
    position: {
      x: confirm.getPosition().x - 45,
      y: confirm.getPosition().y,
    },
  });
  cancel.on(DisplayObjectEvent.POINTER_TAP, async () => {
     $container.$destroy();
   });

  $card.add(modal, close, title, description, confirm, cancel);

  const $resize = (size: Size) => {
    const { width, height } = size;
    background.setRectangle(width, height);
    $card.setPosition({
      x: width / 2,
      y: height / 2,
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
