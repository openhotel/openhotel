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
  textSprite,
  VerticalAlign,
  HorizontalAlign,
} from "@tu/tulip";
import { logoComponent } from "modules/main";
import { System } from "system";
import { SystemEvent, TextureEnum, SpriteSheetEnum } from "shared/enums";
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
  const hotBarBounds = $hotBar.getBounds();
  $container.add($logo, $hotBar);

  const windowBounds = global.getApplication().window.getBounds();
  const onlineUsers = textSprite({
    text: "Online guests: 0",
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 5,
      y: windowBounds.height - hotBarBounds.height,
    },
    backgroundPadding: {
      top: 2,
      right: 4,
      bottom: 2,
      left: 4,
    },
    backgroundAlpha: 0.5,
    backgroundColor: 0,
  });

  const loadUsersOnline = async () => {
    const targetRoomTextList = [];
    const { count } = await System.api.fetch<{
      count: number;
    }>("/user-online", {
      type: "private",
    });
    onlineUsers.setText(`Online guests: ${count}`);
  };
  $container.add(onlineUsers);

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
    onlineUsers.setPositionY(size.height - hotBarBounds.height);
  };
  $rePositionBackground(global.getApplication().window.getBounds());
  $container.add(background);

  let $removeOnResize;
  let reloadInterval;
  $container.on(DisplayObjectEvent.MOUNT, async (e) => {
    $removeOnResize = global.events.on(Event.RESIZE, $rePositionBackground);

    await loadUsersOnline();

    reloadInterval = setInterval(() => {
      if (!$container.getVisible()) return;
      loadUsersOnline();
    }, 30_000);

    if (System.config.get().version !== "development") await wait(1250);
    if (!$container.isMounted()) return;

    System.events.emit(SystemEvent.SHOW_NAVIGATOR_MODAL);
  });
  $container.on(DisplayObjectEvent.UNMOUNT, (e) => {
    $removeOnResize();
    clearInterval(reloadInterval);
    System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);
  });

  return $container.getComponent(homeComponent);
};
