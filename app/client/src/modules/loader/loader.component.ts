import {
  container,
  DisplayObjectEvent,
  Event,
  global,
  graphics,
  GraphicType,
  HorizontalAlign,
  textSprite,
  VerticalAlign,
} from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { Size2d } from "shared/types";
import { System } from "system";
import { getBorderPolygon } from "shared/utils/polygon.utils";

export const loaderComponent = () => {
  const $container = container({
    zIndex: Number.MAX_SAFE_INTEGER,
  });

  const bounds = global.getApplication().window.getBounds();
  const $background = graphics({
    type: GraphicType.RECTANGLE,
    ...bounds,
    tint: 0,
    alpha: 0.5,
  });
  $container.add($background);

  const $loaderSize = {
    width: 200,
    height: 50,
  };
  const $cardContainer = container({
    pivot: {
      x: $loaderSize.width / 2,
      y: $loaderSize.height / 2,
    },
    position: {
      x: bounds.width / 2,
      y: bounds.height / 2,
    },
  });
  $container.add($cardContainer);

  const $cardBackground = graphics({
    type: GraphicType.RECTANGLE,
    width: $loaderSize.width,
    height: $loaderSize.height,
    tint: 0xff00ff,
    alpha: 0,
  });
  const $text = textSprite({
    text: "Loading...",
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    horizontalAlign: HorizontalAlign.CENTER,
    verticalAlign: VerticalAlign.MIDDLE,
    size: $loaderSize,
    pivot: {
      x: 0,
      y: 7,
    },
  });

  const $loaderContainer = container({
    position: {
      x: 0,
      y: $loaderSize.height / 2,
    },
  });
  const $graphicsLoader = graphics({
    type: GraphicType.POLYGON,
    polygon: getBorderPolygon({
      size: { width: $loaderSize.width, height: 10 },
      border: 1,
    }),
  });
  const $graphicsLoadingBar = graphics({
    type: GraphicType.RECTANGLE,
    width: $loaderSize.width - 4,
    height: 10 - 4,
    position: {
      x: 2,
      y: 2,
    },
  });
  $loaderContainer.add($graphicsLoader, $graphicsLoadingBar);

  $cardContainer.add($cardBackground, $loaderContainer, $text);

  const $onResize = (size: Size2d) => {
    $background.setRectangle(size.width, size.height);
    $cardContainer.setPosition({ x: size.width / 2, y: size.height / 2 });
  };

  const { onMessage, onPercentage } = System.loader;

  onMessage((message) => {
    $text.setText(message);
  });

  onPercentage((percentage) => {
    $graphicsLoadingBar.setRectangle(
      ($loaderSize.width - 4) * percentage,
      10 - 4,
    );
  });

  let $removeOnResizeEvent;
  $container.on(DisplayObjectEvent.ADDED, () => {
    $removeOnResizeEvent = global.events.on(Event.RESIZE, $onResize);
  });
  $container.on(DisplayObjectEvent.REMOVED, () => {
    $removeOnResizeEvent();
  });

  return $container.getComponent(loaderComponent);
};
