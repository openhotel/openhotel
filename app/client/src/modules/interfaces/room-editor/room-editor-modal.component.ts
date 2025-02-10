import { ContainerComponent, DisplayObjectEvent, EventMode } from "@tu/tulip";
import { SystemEvent } from "shared/enums";
import { System } from "system";
import { buttonComponent, modalComponent } from "shared/components";

type Props = {
  visible: boolean;
};

export const roomEditorModalComponent: ContainerComponent<Props> = (
  { visible } = { visible: false },
) => {
  const onClose = () => {
    console.log("onClose");
  };

  const $modal = modalComponent({
    visible,
    sortableChildren: true,
    eventMode: EventMode.STATIC,
    width: 200,
    height: 200,
    onClose,
  });

  const load = async () => {
    console.log("load");
    const $a = buttonComponent({
      text: "Aceptar",
      width: 50,
      position: {
        x: 20,
        y: 40,
      },
    });

    $modal.add($a);
  };

  let removeOnShowRoomEditorModal: Function;
  let removeOnHideRoomEditorModal: Function;

  $modal.on(DisplayObjectEvent.ADDED, async () => {
    removeOnShowRoomEditorModal = System.events.on(
      SystemEvent.SHOW_ROOM_EDITOR_MODAL,
      () => $modal.setVisible(true),
    );
    removeOnHideRoomEditorModal = System.events.on(
      SystemEvent.HIDE_ROOM_EDITOR_MODAL,
      () => $modal.setVisible(false),
    );
    await load();
  });

  $modal.on(DisplayObjectEvent.REMOVED, () => {
    removeOnShowRoomEditorModal?.();
    removeOnHideRoomEditorModal?.();
  });

  return $modal.getComponent(roomEditorModalComponent);
};
