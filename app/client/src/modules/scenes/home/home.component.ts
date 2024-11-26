import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event,
  global,
  sprite,
  textSprite,
  Size,
} from "@tu/tulip";
import { logoComponent } from "modules/main";
import { hotBarComponent } from "modules/interfaces";
import { System } from "system";
import { SpriteSheetEnum, SystemEvent, TextureEnum } from "shared/enums";

type Props = {};

export const homeComponent: ContainerComponent<Props> = () => {
  const $container = container({
    sortableChildren: true,
  });

  const $logo = logoComponent();
  $logo.setPosition({ x: 10, y: 20 });

  const { name, description } = System.config.get();

  const $name = textSprite({
    spriteSheet: SpriteSheetEnum.BOLD_FONT,
    text: name,
  });
  $name.setPosition({ x: 60, y: 90 });
  const $description = textSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: description,
  });
  $description.setPosition({ x: 60, y: 98 });
  $container.add($name, $description);

  const $hotBar = hotBarComponent();
  $container.add($logo, $hotBar);

  const background = sprite({
    texture: TextureEnum.HOTEL_ALPHA_V1,
    zIndex: -1,
  });
  const backgroundBounds = background.getBounds();

  const $rePositionBackground = (size: Size) => {
    background.setPivot({
      x: backgroundBounds.width / 2 - size.width / 2,
      y: backgroundBounds.height / 2 - size.height / 2,
    });
  };
  $rePositionBackground(global.getApplication().window.getBounds());
  $container.add(background);

  let $removeOnResize;
  $container.on(DisplayObjectEvent.MOUNT, (e) => {
    System.events.emit(SystemEvent.SHOW_NAVIGATOR_MODAL);

    $removeOnResize = global.events.on(Event.RESIZE, $rePositionBackground);
  });
  $container.on(DisplayObjectEvent.UNMOUNT, (e) => {
    $removeOnResize();
  });

  return $container.getComponent(homeComponent);
};
