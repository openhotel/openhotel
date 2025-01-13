import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  graphics,
  GraphicType,
  sprite,
} from "@tu/tulip";
import { CatalogCategory, SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";
import { CATALOG_CATEGORY_PARAMS_MAP } from "shared/consts/catalog.consts";
import { catalogSectionComponent } from "./catalog-section.component";

type Props = {
  visible: boolean;
};

export const catalogModalComponent: ContainerComponent<Props> = (
  { visible } = { visible: false },
) => {
  const $container = container({
    visible,
    sortableChildren: true,
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
    spriteSheet: SpriteSheetEnum.CATALOG,
    texture: "content",
    position: {
      x: 37,
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

  const loadComponents = async () => {
    const categoryComponentMap: Record<CatalogCategory, any> = Object.keys(
      CATALOG_CATEGORY_PARAMS_MAP,
    ).reduce(
      (acc, category) => {
        const { label } = CATALOG_CATEGORY_PARAMS_MAP[category];
        acc[category] = catalogSectionComponent({
          size: contentSize,
          label: label,
        });
        return acc;
      },
      {} as Record<CatalogCategory, any>,
    );

    let selectedCategory: CatalogCategory = CatalogCategory.ALPHA;
    $content.add(categoryComponentMap[selectedCategory]);

    const selectionTabItem = sprite({
      spriteSheet: SpriteSheetEnum.CATALOG,
      texture: (selectedCategory as number) === 0 ? "selector-top" : "selector",
      position: {
        x: 6,
        y: 20 + selectedCategory * 26,
      },
      zIndex: 11,
    });
    $container.add(selectionTabItem);
    for (
      let categoryIndex = 0;
      categoryIndex < Object.keys(CATALOG_CATEGORY_PARAMS_MAP).length;
      categoryIndex++
    ) {
      const texture = CATALOG_CATEGORY_PARAMS_MAP[categoryIndex].sprite;
      const tabItem = sprite({
        spriteSheet: SpriteSheetEnum.CATALOG,
        texture: "selector-disabled",
        position: {
          x: 6,
          y: 20 + categoryIndex * 26,
        },
        zIndex: 9,
        eventMode: EventMode.STATIC,
        cursor: Cursor.POINTER,
      });
      tabItem.on(DisplayObjectEvent.POINTER_TAP, () => {
        selectionTabItem.setPositionY(20 + categoryIndex * 26);
        selectionTabItem.setTexture(
          categoryIndex === 0 ? "selector-top" : "selector",
          SpriteSheetEnum.CATALOG,
        );

        $content.remove(categoryComponentMap[selectedCategory]);
        selectedCategory = categoryIndex;
        $content.add(categoryComponentMap[selectedCategory]);
      });
      const tabItemTexture = sprite({
        spriteSheet: SpriteSheetEnum.CATALOG,
        texture,
        position: {
          x: 12,
          y: 23 + categoryIndex * 26,
        },
        zIndex: 12,
        eventMode: EventMode.NONE,
      });
      $container.add(tabItem, tabItemTexture);
    }
  };

  const $content = container({
    position: {
      x: 43,
      y: 26,
    },
    zIndex: 20,
  });
  $container.add($content);

  let removeOnShowCatalogModal;
  let removeOnHideCatalogModal;
  let removeOnToggleCatalogModal;

  $container.on(DisplayObjectEvent.ADDED, async () => {
    removeOnToggleCatalogModal = System.events.on(
      SystemEvent.TOGGLE_CATALOG_MODAL,
      () => {
        $container.setVisible((visible) => !visible);
      },
    );
    removeOnShowCatalogModal = System.events.on(
      SystemEvent.SHOW_CATALOG_MODAL,
      () => {
        $container.setVisible(true);
      },
    );
    removeOnHideCatalogModal = System.events.on(
      SystemEvent.HIDE_CATALOG_MODAL,
      () => {
        $container.setVisible(false);
      },
    );
    await loadComponents();
  });

  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnShowCatalogModal();
    removeOnHideCatalogModal();
    removeOnToggleCatalogModal();
  });

  return $container.getComponent(catalogModalComponent);
};
