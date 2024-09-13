import {
  container,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
  nineSliceSprite,
  textSprite,
  VerticalAlign,
  NineSliceSpriteMutable,
} from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { __ } from "shared/utils";
import {
  favoritesCategoryComponent,
  ownCategoryComponent,
  popularCategoryComponent,
  topCategoryComponent,
} from "./categories";
export const tabsComponent = () => {
  const $container = container({
    sortableChildren: true,
  });

  const $contentContainer = container({
    cursor: Cursor.ALIAS,
    eventMode: EventMode.STATIC,
    zIndex: 10,
  });

  const width = 51;
  const height = 40;
  const pivotY = 13;

  const options = ["Popular", "Top", "My own", "Favorites"];
  const optionsComponents = [
    popularCategoryComponent(),
    topCategoryComponent(),
    ownCategoryComponent(),
    favoritesCategoryComponent(),
  ];
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
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
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

  const $backgroundModal = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "modal-2",
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width: 201,
    height: 165,
    position: {
      x: 0,
      y: 13,
    },
  });

  $container.add($backgroundModal, $contentContainer);

  return $container.getComponent(tabsComponent);
};
