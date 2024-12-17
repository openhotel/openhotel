import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event,
  global,
  sprite,
  Size,
  graphics,
  GraphicType,
  Env,
} from "@tu/tulip";
import { logoComponent } from "modules/main";
import { System } from "system";
import { SystemEvent, TextureEnum } from "shared/enums";
import { hotBarComponent } from "modules/interfaces";
import { BLACK_BAR_HEIGHT } from "shared/consts";
import { wait } from "shared/utils";

type Props = {};

export const homeComponent: ContainerComponent<Props> = () => {
  const $container = container({
    sortableChildren: true,
  });

  const $logo = logoComponent();
  $logo.setPosition({
    x: 5,
    y: 5,
  });

  const height = BLACK_BAR_HEIGHT + global.envs.get(Env.SAFE_AREA_INSET_BOTTOM);
  const upperBar = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: height + 2,
    tint: 0x0,
  });
  $container.add(upperBar);

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
    upperBar.setRectangle(size.width, height + 2);
  };
  $rePositionBackground(global.getApplication().window.getBounds());
  $container.add(background);

  let $removeOnResize;
  $container.on(DisplayObjectEvent.MOUNT, async (e) => {
    $removeOnResize = global.events.on(Event.RESIZE, $rePositionBackground);

    if (System.config.get().version !== "development") await wait(1250);
    if (!$container.isMounted()) return;

    System.events.emit(SystemEvent.SHOW_NAVIGATOR_MODAL);
  });
  $container.on(DisplayObjectEvent.UNMOUNT, (e) => {
    $removeOnResize();
    System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);
  });

  return $container.getComponent(homeComponent);
};
