import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event as TulipEvent,
  EventMode,
  global,
} from "@tu/tulip";
import { bubbleChatComponent, systemMessageComponent } from "modules/chat";
import {
  previewComponent,
  roomComponent,
  hotBarChatComponent,
  roomInfoComponent,
} from ".";
import { Point2d, Size2d } from "shared/types";
import { System } from "system";
import { SystemEvent } from "shared/enums";
import { HOT_BAR_HEIGHT } from "shared/consts";

const CHAT_PADDING = {
  x: 12,
  y: 15,
};

const PREVIEW_PADDING = {
  x: 80,
  y: 180,
};

export type PrivateRoomMutable = {
  getPosition: () => Point2d;
};

export const privateRoomComponent: ContainerComponent<
  {},
  PrivateRoomMutable
> = () => {
  const $container = container({
    sortableChildren: true,
  });

  //TODO move to mount
  const windowBounds = global.getApplication().window.getBounds();

  //TODO move to mount
  const hotBar = hotBarChatComponent();
  const roomInfo = roomInfoComponent();
  $container.add(hotBar, roomInfo);

  //TODO move to mount
  const systemMessage = systemMessageComponent({
    position: {
      x: 0,
      y: windowBounds.height - CHAT_PADDING.y - 24,
    },
  });
  $container.add(systemMessage);

  //TODO move to mount
  const $preview = previewComponent({
    position: {
      x: windowBounds.width - PREVIEW_PADDING.x,
      y: windowBounds.height - PREVIEW_PADDING.y,
    },
  });
  $container.add($preview);

  //TODO move to mount
  global.events.on(TulipEvent.RESIZE, (size: Size2d) => {
    $preview.setPosition({
      x: size.width - PREVIEW_PADDING.x,
      y: size.height - PREVIEW_PADDING.y,
    });
    $room.setPosition({
      x: size.width / 2,
      y: size.height / 2 - HOT_BAR_HEIGHT,
    });
  });

  let $room;
  let $bubbleChat;

  //TODO move to mount
  let $roomScene = container({
    sortableChildren: true,
    eventMode: EventMode.STATIC,
  });

  $container.add($roomScene);
  let onRemovePointerDown;
  let onRemovePointerMove;
  let onRemovePointerUp;
  let onRemoveEnableCamera;
  let onRemoveDisableCamera;

  $container.on(DisplayObjectEvent.MOUNT, () => {
    $roomScene.setPosition({ x: 0, y: 0 });
    if ($room) $roomScene.remove($room);

    const windowBounds = global.getApplication().window.getBounds();
    $room = roomComponent({
      position: {
        x: windowBounds.width / 2,
        y: windowBounds.height / 2 - HOT_BAR_HEIGHT,
      },
    });
    $roomScene.add($room);

    if ($bubbleChat) $roomScene.remove($bubbleChat);
    $bubbleChat = bubbleChatComponent({ room: $room });
    $roomScene.add($bubbleChat);

    let isEnabled = true;
    const margin = 100;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let containerStart = { x: 0, y: 0 };

    onRemoveEnableCamera = System.events.on(
      SystemEvent.ENABLE_CAMERA_MOVEMENT,
      () => {
        isEnabled = true;
      },
    );

    onRemoveDisableCamera = System.events.on(
      SystemEvent.DISABLE_CAMERA_MOVEMENT,
      () => {
        isEnabled = false;
      },
    );

    onRemovePointerDown = global.events.on(TulipEvent.POINTER_DOWN, (event) => {
      if (!isEnabled || (event.type === "mousedown" && event.button !== 0))
        return;
      isDragging = true;
      dragStart = {
        x: event.x ?? event.touches[0]?.clientX,
        y: event.y ?? event.touches[0]?.clientY,
      };

      containerStart = $roomScene.getGlobalPosition();
    });

    onRemovePointerMove = global.events.on(TulipEvent.POINTER_MOVE, (event) => {
      if (!isDragging) return;
      System.events.emit(SystemEvent.TEST, "pointer move ");

      const scale = global.window.getScale();
      const deltaX =
        ((event.clientX ?? event.touches[0]?.clientX) - dragStart.x) / scale;
      const deltaY =
        ((event.clientY ?? event.touches[0]?.clientY) - dragStart.y) / scale;

      let newX = Math.floor(containerStart.x + deltaX);
      let newY = Math.floor(containerStart.y + deltaY);

      const { width, height } = $roomScene.getBounds();

      const minX = -width / 2 + margin;
      const maxX = width / 2 - margin;
      const minY = -height / 2 + margin;
      const maxY = height / 2 - margin;

      $roomScene.setPosition({
        x: Math.max(minX, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY)),
      });
    });

    onRemovePointerUp = global.events.on(TulipEvent.POINTER_UP, (event) => {
      if (
        (event instanceof MouseEvent && event.button == 0) ||
        event instanceof TouchEvent
      ) {
        isDragging = false;
      }
    });

    System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);
  });

  $container.on(DisplayObjectEvent.UNMOUNT, () => {
    onRemovePointerDown?.();
    onRemovePointerMove?.();
    onRemovePointerUp?.();
    onRemoveEnableCamera?.();
    onRemoveDisableCamera?.();
  });

  return $container.getComponent(privateRoomComponent, {
    getPosition: () => $roomScene.getPosition(),
  });
};
