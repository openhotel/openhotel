import {
  container,
  DisplayObjectEvent,
  Event,
  global,
  graphics,
  GraphicType,
} from "@tu/tulip";
import { Size2d } from "shared/types";
import { System } from "system";
import { TickerQueue } from "@oh/queue";
import { wait } from "shared/utils";

const DELTA_MULTIPLIER = 0.35;

export const vignetteTransitionComponent = () => {
  const $container = container({
    zIndex: 20,
  });

  const size = global.getApplication().window.getBounds();

  const resize = (size: Size2d) => {
    upperRectangle.setRectangle(size.width, size.height / 2);
    belowRectangle.setRectangle(size.width, size.height / 2);

    belowRectangle.setPivot({ x: 0, y: -size.height / 2 });
  };

  const upperRectangle = graphics({
    type: GraphicType.RECTANGLE,
    width: size.width,
    height: size.height / 2,
    tint: 0,
  });
  const belowRectangle = graphics({
    type: GraphicType.RECTANGLE,
    width: size.width,
    height: size.height / 2,
    tint: 0,
    pivot: {
      x: 0,
      y: -size.height / 2,
    },
  });
  $container.add(upperRectangle, belowRectangle);

  let onRemoveResize;

  $container.on(DisplayObjectEvent.MOUNT, async () => {
    onRemoveResize = global.events.on(Event.RESIZE, resize);

    await wait(250);
    System.tasks.add({
      type: TickerQueue.DURATION,
      duration: 750,
      onFunc: (delta) => {
        upperRectangle.setPositionY((y) => y - delta * DELTA_MULTIPLIER);
        belowRectangle.setPositionY((y) => y + delta * DELTA_MULTIPLIER);
      },
      onDone: () => {
        $container.$destroy();
      },
    });
  });

  $container.on(DisplayObjectEvent.UNMOUNT, () => {
    onRemoveResize?.();
  });

  return $container.getComponent(vignetteTransitionComponent);
};
