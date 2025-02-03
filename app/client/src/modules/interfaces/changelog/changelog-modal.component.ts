import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  global,
  graphics,
  GraphicType,
  sprite,
  Event,
  scrollableContainer,
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
  const base = sprite({
    spriteSheet: SpriteSheetEnum.CATALOG,
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
      x: 8,
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

  const $versionsList = scrollableContainer({
    position: {
      x: 12,
      y: 25,
    },
    zIndex: 20,
    size: {
      width: contentSize.width - 10,
      height: contentSize.height - 10,
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

  $container.add($versionsList);

  const load = async () => {
    let currentY = 0;
    const padding = 4;

    const changes = await System.version.getChangelogChanges();
    for (const content of changes) {
      let versionY = 0;
      const { version, date, sections } = content;

      const $versionContainer = container({
        size: {
          width: contentSize.width,
          height: padding,
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
            height: padding,
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
        sectionY += $section.getBounds().height + padding;

        for (const issue of sections[section]) {
          const $issue = textSprite({
            text: `- ${issue}`,
            spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
            color: 0,
            position: {
              x: 0,
              y: sectionY,
            },
          });

          $sectionContainer.add($issue);

          sectionY += $issue.getBounds().height;
        }

        $versionContainer.add($sectionContainer);
        versionY += $sectionContainer.getBounds().height + padding;
      }

      $versionsList.add($versionContainer);
      currentY += versionY + padding * 2;
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
