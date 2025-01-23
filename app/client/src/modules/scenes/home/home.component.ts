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
} from "@tu/tulip";
import { logoComponent, socialsComponent } from "modules/main";
import { System } from "system";
import { SystemEvent, TextureEnum, SpriteSheetEnum } from "shared/enums";
import { hotBarComponent } from "modules/interfaces";
import { BLACK_BAR_HEIGHT, CONTRIBUTOR_LOOP_TIME } from "shared/consts";
import { wait } from "shared/utils";
import { TickerQueue } from "@oh/queue";

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

  const $socialsComponent = socialsComponent();
  const $rePositionSocials = (size: Size) => {
    $socialsComponent.setPosition({
      x: size.width - $socialsComponent.getBounds().width - 10,
      y:
        upperBar.getBounds().height / 2 -
        $socialsComponent.getBounds().height / 2,
    });
  };

  const $hotBar = hotBarComponent();
  $container.add($logo, $hotBar, $socialsComponent);

  const onlineUsers = textSprite({
    text: "0 guests online",
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 0,
      y: 18,
    },
    backgroundPadding: {
      top: 2,
      right: 4,
      bottom: 2,
      left: 4,
    },
    backgroundAlpha: 0.5,
    backgroundColor: 0,
    visible: false,
  });
  const $rePositionOnlineUsers = (size: Size) => {
    onlineUsers.setPositionX(
      size.width / 2 - onlineUsers.getBounds().width / 2,
    );
  };

  const loadUsersOnline = async () => {
    const { count } = await System.api.fetch<{
      count: number;
    }>("/online-users");
    onlineUsers.setText(`${count} guest${count === 1 ? "" : "s"} online`);
  };
  $container.add(onlineUsers);

  const background = sprite({
    texture: TextureEnum.HOTEL_ALPHA_V1,
    zIndex: -1,
  });
  const backgroundBounds = background.getBounds();

  let creatorIndex = 1;
  let contributorIndex = 0;
  const creators = System.contributors.getCreators();
  const contributors = System.contributors.getContributors();
  const $contributorContainer = container({
    pivot: {
      x: -10,
      y: 55,
    },
  });
  $container.add($contributorContainer);
  const $contributorsText = textSprite({
    text: `Created by ${creators[0].login}`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    position: {
      x: 0,
      y: 0,
    },
    backgroundColor: 0x0,
    backgroundAlpha: 0.25,
    backgroundPadding: {
      bottom: 2,
      top: 2,
      left: 4,
      right: 4,
    },

    color: 0xffffff,
  });
  $contributorContainer.add($contributorsText);

  const $rePositionContributions = (size: Size) => {
    $contributorContainer.setPositionY(size.height);
  };

  const $rePositionBackground = (size: Size) => {
    background.setPivot({
      x: backgroundBounds.width / 2 - size.width / 2,
      y: backgroundBounds.height / 2 - size.height / 2,
    });
    upperBar.setRectangle(size.width, height + 2);
    $rePositionOnlineUsers(size);
    $rePositionContributions(size);
    $rePositionSocials(size);
  };
  $container.add(background);

  let $removeOnResize;
  let reloadInterval;
  let repeatContributorsTaskId;

  $container.on(DisplayObjectEvent.MOUNT, async (e) => {
    $removeOnResize = global.events.on(Event.RESIZE, $rePositionBackground);

    await loadUsersOnline();

    reloadInterval = setInterval(() => {
      if (!$container.isMounted()) return;
      loadUsersOnline();
    }, 30_000);

    const size = global.getApplication().window.getBounds();
    $rePositionBackground(size);

    if (System.config.get().version !== "development") await wait(1_250);
    if (!$container.isMounted()) return;

    onlineUsers.setVisible(true);
    $rePositionOnlineUsers(size);

    System.events.emit(SystemEvent.SHOW_NAVIGATOR_MODAL);

    repeatContributorsTaskId = System.tasks.add({
      type: TickerQueue.REPEAT,
      repeatEvery: CONTRIBUTOR_LOOP_TIME,
      repeats: Number.MAX_SAFE_INTEGER,
      onFunc: () => {
        if (creators.length > creatorIndex) {
          $contributorsText.setText(
            `Created by ${creators[creatorIndex].login}`,
          );
          creatorIndex++;
        } else if (contributors.length > contributorIndex) {
          $contributorsText.setText(
            `Contributed by ${contributors[contributorIndex].login}`,
          );
          contributorIndex++;
        }
        if (contributorIndex >= contributors.length) {
          creatorIndex = 0;
          contributorIndex = 0;
        }
      },
    });
  });
  $container.on(DisplayObjectEvent.UNMOUNT, (e) => {
    $removeOnResize();
    clearInterval(reloadInterval);
    System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);

    System.tasks.remove(repeatContributorsTaskId);
  });

  return $container.getComponent(homeComponent);
};
