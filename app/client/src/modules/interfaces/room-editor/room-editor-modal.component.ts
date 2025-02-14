import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";
import {
  buttonComponent,
  inputComponent,
  modalComponent,
} from "shared/components";
import { __ } from "../../../shared/utils";

type Props = {
  visible: boolean;
};

export const roomEditorModalComponent: ContainerComponent<Props> = (
  { visible } = { visible: false },
) => {
  const MIN_LAYOUT = 2;
  const MAX_LAYOUT = 10;

  const $modal = modalComponent({
    visible,
    sortableChildren: true,
    eventMode: EventMode.STATIC,
    width: 230,
    height: 320,
  });

  const $form = container({
    sortableChildren: true,
    eventMode: EventMode.STATIC,
  });

  $modal.add($form);

  const createOptions = (title: string, onChange: () => void) => {
    let value = 4;

    const $container = container();

    const $title = textSprite({
      text: title,
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      color: 0,
      position: {
        x: 0,
        y: 0,
      },
    });

    const $value = textSprite({
      text: value.toString(),
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      color: 0,
      position: {
        x: 23,
        y: 12,
      },
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
    });

    const $onChange =
      (v = 1) =>
      () => {
        if (value + v < MIN_LAYOUT || value + v > MAX_LAYOUT) return;
        value += v;
        $value.setText(value.toString());
        onChange();
      };

    const $less = buttonComponent({
      text: "-",
      width: 3,
      position: {
        x: 8,
        y: 12,
      },
    });
    $less.on(DisplayObjectEvent.POINTER_TAP, $onChange(-1));

    const $add = buttonComponent({
      text: "+",
      width: 3,
      position: {
        x: 40,
        y: 12,
      },
    });
    $add.on(DisplayObjectEvent.POINTER_TAP, $onChange(1));

    $container.add($title, $add, $less, $value);
    return {
      component: $container,
      getValue: () => value,
    };
  };

  const createLayout = (width: number, height: number, deep: number) => {
    const $container = container();

    const states = [
      "x",
      "s",
      ...Array.from({ length: deep }, (_, i) => (i + 1).toString()),
    ];

    const cellSize = 8;
    const spacing = 10;

    const cells: any[][] = [];
    for (let row = 0; row < height; row++) {
      const rowCells: any[] = [];
      for (let col = 0; col < width; col++) {
        const initialStateIndex = 2;
        const $cell = buttonComponent({
          text: states[initialStateIndex],
          width: cellSize,
          position: {
            x: col * (cellSize + spacing),
            y: row * (cellSize + spacing),
          },
        });

        let currentStateIndex = initialStateIndex;
        $cell.on(DisplayObjectEvent.POINTER_TAP, () => {
          currentStateIndex = (currentStateIndex + 1) % states.length;
          $cell.setText(states[currentStateIndex]);
        });

        rowCells.push($cell);
        $container.add($cell);
      }
      cells.push(rowCells);
    }

    const getLayout = () => {
      return cells.map((rowCells) =>
        rowCells.map((cell) => cell.getText()).join(""),
      );
    };

    return { component: $container, getLayout };
  };

  const load = async () => {
    let $layout;

    const $name = inputComponent({
      placeholder: __("Room name"),
      horizontalAlign: HorizontalAlign.LEFT,
      width: 100,
      maxLength: 40,
      position: {
        x: 20,
        y: 30,
      },
    });

    const $description = inputComponent({
      placeholder: __("Room description"),
      horizontalAlign: HorizontalAlign.LEFT,
      width: 120,
      maxLength: 80,
      position: {
        x: 20,
        y: 50,
      },
    });
    $form.add($name, $description);

    const onChange = () => {
      if ($layout) $form.remove($layout.component);
      $layout = createLayout(getCols(), getRows(), getDeep());
      $layout.component.setPosition({
        x: 28,
        y: 105,
      });
      $form.add($layout.component);
    };

    const { component: $rowsOption, getValue: getRows } = createOptions(
      "Rows",
      onChange,
    );
    $rowsOption.setPosition({
      x: 20,
      y: 70,
    });

    const { component: $colsOption, getValue: getCols } = createOptions(
      "Cols",
      onChange,
    );
    $colsOption.setPosition({
      x: 80,
      y: 70,
    });

    const { component: $deepOption, getValue: getDeep } = createOptions(
      "Deep",
      onChange,
    );
    $deepOption.setPosition({
      x: 140,
      y: 70,
    });

    $form.add($rowsOption, $colsOption, $deepOption);

    onChange();

    const $create = buttonComponent({
      text: __("Create"),
      width: 30,
      position: {
        x: $modal.getContentSize().width / 2 - 10,
        y: $modal.getContentSize().height,
      },
    });
    $create.on(DisplayObjectEvent.POINTER_TAP, async () => {
      await System.api.fetch(
        "/room",
        {
          title: $name.getValue().trim(),
          description: $description.getValue().trim(),
          layout: $layout.getLayout(),
        },
        false,
        "PUT",
      );

      $modal.setVisible(false);
      $form.removeAll();
    });
    $form.add($create);
  };

  let removeOnShowRoomEditorModal: Function;
  let removeOnHideRoomEditorModal: Function;

  $modal.on(DisplayObjectEvent.ADDED, async () => {
    removeOnShowRoomEditorModal = System.events.on(
      SystemEvent.SHOW_ROOM_EDITOR_MODAL,
      async () => {
        await load();
        $modal.setVisible(true);
      },
    );
    removeOnHideRoomEditorModal = System.events.on(
      SystemEvent.HIDE_ROOM_EDITOR_MODAL,
      () => $modal.setVisible(false),
    );
  });

  $modal.on(DisplayObjectEvent.REMOVED, () => {
    removeOnShowRoomEditorModal?.();
    removeOnHideRoomEditorModal?.();
  });

  return $modal.getComponent(roomEditorModalComponent);
};
