import {
  container,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
  nineSliceSprite,
  textSprite,
  VerticalAlign,
} from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { __ } from "shared/utils";
import { NineSliceSpriteMutable } from "@tu/tulip/src/types";
import { publicSpacesComponent } from "./public-spaces";
import { privateRoomsComponent } from "./private-rooms";

export const mainTabsComponent = () => {
  const $container = container({
    position: {
      x: 6,
      y: 25,
    },
  });

  const $contentContainer = container({
    sortableChildren: true,
  });

  const height = 40;
  const width = 101;
  const pivotY = 8;

  const options = ["Public spaces", "Private rooms"];
  const optionsComponents = [publicSpacesComponent(), privateRoomsComponent()];
  let selectorList: NineSliceSpriteMutable[] = [];

  let selectedIndex = 0;
  $contentContainer.add(optionsComponents[selectedIndex]);

  for (let index = 0; index < options.length; index++) {
    const option = options[index];
    const tabSelector = nineSliceSprite({
      spriteSheet: SpriteSheetEnum.UI,
      texture:
        selectedIndex === index ? "modal-1-selected" : "modal-1-unselected",
      leftWidth: 6,
      topHeight: 6,
      rightWidth: 6,
      bottomHeight: 6,
      width,
      height,
      cursor: Cursor.POINTER,
      eventMode: EventMode.STATIC,
      position: {
        x: index * width - index,
        y: 0,
      },
      zIndex: -1,
    });
    tabSelector.on(DisplayObjectEvent.POINTER_TAP, () => {
      if (selectedIndex === index) return;

      selectorList[selectedIndex].setTexture(
        "modal-1-unselected",
        SpriteSheetEnum.UI,
      );
      tabSelector.setTexture("modal-1-selected", SpriteSheetEnum.UI);
      $contentContainer.remove(optionsComponents[selectedIndex]);
      selectedIndex = index;
      $contentContainer.add(optionsComponents[selectedIndex]);
    });
    selectorList.push(tabSelector);

    const tabText = textSprite({
      spriteSheet: SpriteSheetEnum.BOLD_FONT,
      tint: 0x4b4e54,
      text: __(option),
      size: {
        width,
        height,
      },
      pivot: {
        x: 0,
        y: pivotY,
      },
      horizontalAlign: HorizontalAlign.CENTER,
      verticalAlign: VerticalAlign.MIDDLE,
      eventMode: EventMode.NONE,
      position: {
        x: index * width - index,
        y: 0,
      },
    });

    $container.add(tabSelector, tabText);
  }
  $container.add($contentContainer);

  return $container.getComponent(mainTabsComponent);
};
