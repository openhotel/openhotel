import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  Event,
  EventMode,
  global,
  nineSliceSprite,
  scrollableContainer,
  sprite,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";

type Props = {
  visible: boolean;
};

export const changelogModalComponent: ContainerComponent<Props> = (
  { visible } = { visible: true },
) => {
  const $container = container({
    visible,
    sortableChildren: true,
    eventMode: EventMode.STATIC,
  });
  const WIDTH = 300;
  const HEIGHT = 200;
  const PADDING = 12;
  const TEXT_GAP = 4;

  const $base = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "modal-base-rooms",
    leftWidth: 11,
    topHeight: 11,
    rightWidth: 11,
    bottomHeight: 11,
    width: WIDTH,
    height: HEIGHT,
  });
  $container.add($base);

  const $close = sprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "drag-close",
    position: {
      x: $base.getBounds().width - 25,
      y: 3,
    },
    cursor: Cursor.POINTER,
    eventMode: EventMode.STATIC,
  });
  $close.on(DisplayObjectEvent.POINTER_TAP, () => {
    $container.setVisible(false);
  });

  const $draggable = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "drag",
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width: $base.getBounds().width - 25 - 8,
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
    width: WIDTH - PADDING,
    height: HEIGHT - $draggable.getBounds().height - PADDING,
    position: {
      x: PADDING / 2,
      y: $draggable.getBounds().height + PADDING / 2,
    },
  });
  $container.add($content);

  const $contentSize = $content.getBounds();
  const contentSize = {
    width: $contentSize.width - PADDING,
    height: $contentSize.height - PADDING,
  };

  const $changelog = scrollableContainer({
    position: {
      x: PADDING,
      y: $draggable.getBounds().height + PADDING,
    },
    zIndex: 20,
    size: {
      width: contentSize.width - PADDING / 2,
      height: contentSize.height - PADDING / 2,
    },
    jump: 3,
    verticalScroll: true,
    horizontalScroll: false,
    components: [
      sprite({
        spriteSheet: SpriteSheetEnum.UI,
        texture: "selector-arrow",
        metadata: "scroll-button-top",
      }),
      sprite({
        spriteSheet: SpriteSheetEnum.UI,
        texture: "selector",
        metadata: "scroll-selector-y",
      }),
      sprite({
        spriteSheet: SpriteSheetEnum.UI,
        texture: "selector-arrow",
        metadata: "scroll-button-bottom",
        scale: {
          y: -1,
          x: 1,
        },
        pivot: {
          x: 0,
          y: 9,
        },
      }),
    ],
  });

  $container.add($changelog);

  const load = async () => {
    let currentY = 0;

    const changes = await System.config.getChangelogChanges();
    for (const content of changes) {
      let versionY = 0;
      const { version, date, sections } = content;

      const $versionContainer = container({
        size: {
          width: contentSize.width,
          height: TEXT_GAP,
        },
        position: {
          x: 0,
          y: currentY,
        },
        eventMode: EventMode.STATIC,
        cursor: Cursor.POINTER,
      });

      const $title = textSprite({
        text: `${version} (${date})`,
        spriteSheet: SpriteSheetEnum.BOLD_FONT,
        color: 0xff0000,
        position: {
          x: 0,
          y: 0,
        },
      });
      $versionContainer.add($title);

      versionY += $title.getBounds().height;

      for (const section in sections) {
        let sectionY = 0;

        const $sectionContainer = container({
          size: {
            width: contentSize.width,
            height: TEXT_GAP,
          },
          position: {
            x: 0,
            y: versionY,
          },
        });

        const $section = textSprite({
          text: section,
          spriteSheet: SpriteSheetEnum.BOLD_FONT,
          color: 0x1e1e1e,
          position: {
            x: 0,
            y: 4,
          },
        });

        $sectionContainer.add($section);
        sectionY += $section.getBounds().height + TEXT_GAP;

        for (const issue of sections[section]) {
          // TODO: height only optional if text wrap...
          // TODO: if wrap link buttons not correct
          const $issue = textSprite({
            text: `- ${issue}`,
            spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
            color: 0,
            position: {
              x: 0,
              y: sectionY,
            },
            // size: {
            //   width: contentSize.width,
            //   height: 14,
            // },
            allowLinks: true,
            parseMarkdown: true,
          });

          $sectionContainer.add($issue);

          sectionY += $issue.getBounds().height;
        }

        $versionContainer.add($sectionContainer);
        versionY += $sectionContainer.getBounds().height + TEXT_GAP;
      }

      $changelog.add($versionContainer);
      currentY += versionY + TEXT_GAP * 2;
    }
  };

  let removeOnShowChangelogModal: Function;
  let removeOnHideChangelogModal: Function;
  let removeOnPointerDown: Function;
  let removeOnPointerUp: Function;

  $container.on(DisplayObjectEvent.ADDED, async () => {
    removeOnPointerDown = $container.on(DisplayObjectEvent.POINTER_DOWN, () => {
      System.events.emit(SystemEvent.DISABLE_CAMERA_MOVEMENT);
    });

    removeOnPointerUp = global.events.on(Event.POINTER_UP, () => {
      System.events.emit(SystemEvent.ENABLE_CAMERA_MOVEMENT);
    });

    removeOnShowChangelogModal = System.events.on(
      SystemEvent.SHOW_CHANGELOG_MODAL,
      () => $container.setVisible(true),
    );
    removeOnHideChangelogModal = System.events.on(
      SystemEvent.HIDE_CHANGELOG_MODAL,
      () => $container.setVisible(false),
    );
    await load();
  });

  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnShowChangelogModal?.();
    removeOnHideChangelogModal?.();
    removeOnPointerDown?.();
    removeOnPointerUp?.();
  });

  return $container.getComponent(changelogModalComponent);
};
