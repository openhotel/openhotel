import {DisplayObjectEvent} from "@tu/tulip";

export function allowCameraPanning(component, margin = 0) {
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let containerStart = { x: 0, y: 0 };

    const pixiContainer = component.getDisplayObject({
        __preventWarning: true,
    });

    component.on(DisplayObjectEvent.POINTER_DOWN, (event) => {
        event.stopPropagation();
        if (event.button !== 0) return;
        isDragging = true;
        dragStart = { x: event.global.x, y: event.global.y };
        containerStart = { x: pixiContainer.x, y: pixiContainer.y };
    });

    component.on(DisplayObjectEvent.POINTER_MOVE, (event) => {
        if (!isDragging) return;

        const deltaX = event.global.x - dragStart.x;
        const deltaY = event.global.y - dragStart.y;

        let newX = Math.floor(containerStart.x + deltaX);
        let newY = Math.floor(containerStart.y + deltaY);

        const minX = - pixiContainer.width / 2 + margin;
        const maxX = pixiContainer.width / 2 - margin;
        const minY = -pixiContainer.height / 2 + margin;
        const maxY = pixiContainer.height / 2 - margin;

        pixiContainer.x = Math.max(minX, Math.min(newX, maxX));
        pixiContainer.y = Math.max(minY, Math.min(newY, maxY));
    });

    component.on(DisplayObjectEvent.POINTER_UP, (event) => {
        if (event.button !== 0) return;
        isDragging = false;
    });

    component.on(DisplayObjectEvent.POINTER_LEAVE, () => {
        isDragging = false;
    });
}
