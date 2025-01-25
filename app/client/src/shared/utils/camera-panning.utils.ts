import { global, Event } from "@tu/tulip";

export function allowCameraPanning(component, margin = 0) {
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let containerStart = { x: 0, y: 0 };

  global.events.on(Event.POINTER_DOWN, (event) => {
    if (event.button !== 0) return;
    isDragging = true;
    dragStart = { x: event.x, y: event.y };

    containerStart = component.getGlobalPosition();
  });

  global.events.on(Event.POINTER_MOVE, (event) => {
    if (!isDragging) return;

    // TODO get this from application
    const scale = 2;
    const deltaX = (event.clientX - dragStart.x) / scale;
    const deltaY = (event.clientY - dragStart.y) / scale;

    let newX = Math.floor(containerStart.x + deltaX);
    let newY = Math.floor(containerStart.y + deltaY);

    const { width, height } = component.getBounds();

    const minX = -width / 2 + margin;
    const maxX = width / 2 - margin;
    const minY = -height / 2 + margin;
    const maxY = height / 2 - margin;

    component.setPositionX(Math.max(minX, Math.min(newX, maxX)));
    component.setPositionY(Math.max(minY, Math.min(newY, maxY)));
  });

  global.events.on(Event.POINTER_UP, (event) => {
    if (event.button !== 0) return;
    isDragging = false;
  });
}
