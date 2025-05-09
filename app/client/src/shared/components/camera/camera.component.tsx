import React, { useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  Event,
  useEvents,
  useWindow,
} from "@openhotel/pixi-components";
import { Point2d } from "shared/types";
import { useCamera } from "shared/hooks";

type Props = {
  children: React.ReactNode;
  contentRef: React.RefObject<{
    getSize: () => { width: number; height: number } | undefined;
  }>;
  margin?: number;
  bottomPadding?: number;
  onOffsetChange?: (offset: Point2d) => void;
};

export const CameraComponent: React.FC<Props> = ({
  children,
  contentRef,
  margin = 50,
  bottomPadding = 0,
  onOffsetChange,
}) => {
  const { getSize } = useWindow();
  const { on: onEvent } = useEvents();

  const [windowSize, setWindowSize] = useState(getSize());
  const [offset, setOffset] = useState<Point2d>({ x: 0, y: 0 });

  const { setDragging, canDrag, setPosition } = useCamera();

  useEffect(() => {
    const onRemoveResize = onEvent(Event.RESIZE, () => {
      setWindowSize(getSize());
    });

    setWindowSize(getSize());

    return () => {
      onRemoveResize();
    };
  }, [onEvent]);

  useEffect(() => {
    const MOVEMENT_THRESHOLD = 5;

    let dragCurrent = null;
    let dragStart = null;

    const onRemovePointerDown = onEvent(
      Event.POINTER_DOWN,
      (e: MouseEvent | TouchEvent) => {
        const { clientX: x, clientY: y } =
          (e as TouchEvent).touches?.[0] ?? (e as MouseEvent);

        dragCurrent = { x, y };
        dragStart = { x, y };
        setDragging(false);
      },
    );

    const onRemovePointerMove = onEvent(
      Event.POINTER_MOVE,
      (e: MouseEvent | TouchEvent) => {
        if (!dragCurrent || !canDrag()) {
          dragCurrent = null;
          dragStart = null;
          return;
        }

        const { clientX: x, clientY: y } =
          (e as TouchEvent).touches?.[0] ?? (e as MouseEvent);

        const dx = x - dragCurrent.x;
        const dy = y - dragCurrent.y;

        setOffset((prev) => {
          const next = { x: prev.x + dx, y: prev.y + dy };
          onOffsetChange?.(next);
          return next;
        });

        const totalDx = x - dragStart.x;
        const totalDy = y - dragStart.y;

        if (
          Math.abs(totalDx) > MOVEMENT_THRESHOLD ||
          Math.abs(totalDy) > MOVEMENT_THRESHOLD
        ) {
          setDragging(true);
        }

        dragCurrent = { x, y };
      },
    );

    const onRemovePointerUp = onEvent(Event.POINTER_UP, () => {
      dragCurrent = null;
      setDragging(false);
    });

    return () => {
      onRemovePointerDown();
      onRemovePointerMove();
      onRemovePointerUp();
    };
  }, [onEvent, onOffsetChange, canDrag, setDragging]);

  const clampedPosition = useMemo(() => {
    const contentSize = contentRef.current?.getSize?.();
    if (!contentSize) return offset;

    const { width: contentWidth, height: contentHeight } = contentSize;
    const { width: screenWidth, height: screenHeight } = windowSize;

    const overflowX = Math.abs(screenWidth - contentWidth);
    let overflowY = Math.abs(screenHeight - contentHeight - bottomPadding);

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(value, max));

    const minX = -overflowX / 2 - margin;
    const maxX = overflowX / 2 + margin;
    const clampedX = clamp(offset.x / 2, minX, maxX);

    const minY = -overflowY / 2 - margin;
    const maxY = overflowY / 2 + margin;
    const clampedY = clamp(offset.y / 2, minY, maxY);

    return { x: Math.round(clampedX), y: Math.round(clampedY) };
  }, [offset, contentRef.current, windowSize, margin, bottomPadding]);

  useEffect(() => {
    setPosition(clampedPosition);
  }, [setPosition, clampedPosition]);

  return (
    <ContainerComponent position={clampedPosition}>
      {children}
    </ContainerComponent>
  );
};
