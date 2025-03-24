import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Env,
  Event,
  global,
  graphics,
  GraphicType,
} from "@tu/tulip";
import { Size2d } from "shared/types";
import { hotBarItemsComponent } from "modules/interfaces";
import { BLACK_BAR_HEIGHT } from "shared/consts";
import { wait } from "shared/utils";
import { System } from "system";
import { TickerQueue } from "@oh/queue";

type Props = {};

const DELTA_MULTIPLIER = 0.25;

export const hotBarComponent: ContainerComponent<Props> = () => {
  const $container = container({
    zIndex: 10,
  });

  const height = BLACK_BAR_HEIGHT + global.envs.get(Env.SAFE_AREA_INSET_BOTTOM);

  const bg = graphics({
    type: GraphicType.RECTANGLE,
    width: 20,
    height: height + 2,
    tint: 0x0,
  });
  $container.add(bg);

  const itemContainer = hotBarItemsComponent({
    pivot: {
      x: 0,
      y: -50,
    },
  });

  $container.on(DisplayObjectEvent.MOUNT, async () => {
    await wait(1250);
    System.tasks.add({
      type: TickerQueue.CUSTOM,
      onFunc: (delta) => {
        if (!itemContainer.isMounted()) return;

        itemContainer.setPivotY((y) => y + delta * DELTA_MULTIPLIER);
        if (itemContainer.getPivot().y >= -5) {
          itemContainer.setPivotY(-5);
          return true;
        }
      },
    });
  });
  $container.add(itemContainer);

  const resize = (size: Size2d) => {
    bg.setRectangle(size.width, height + 2);

    $container.setPositionY(size.height - height - 2);

    const items = itemContainer.getChildren();
    const posX = size.width / items.length;

    const itemWidth = items[0].getBounds().width;

    for (let i = 0; i < items.length; i++)
      items[i].setPosition({
        x: posX / 2 + posX * i - itemWidth / 2,
        y: 2,
      });
  };

  let $onRemoveResize;

  $container.on(DisplayObjectEvent.MOUNT, () => {
    resize(global.getApplication().window.getBounds());
    $onRemoveResize = global.events.on(Event.RESIZE, resize);
  });

  $container.on(DisplayObjectEvent.UNMOUNT, () => {
    $onRemoveResize?.();
  });

  return $container.getComponent(hotBarComponent);
};
