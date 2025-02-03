import React, { useEffect, useRef, useState } from "react";

//@ts-ignore
import styles from "./tooltip.module.scss";
import { cn } from "../../utils";
import { createPortal } from "react-dom";

type Props = {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
};

export const TooltipComponent: React.FC<Props> = ({
  className,
  title,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const tooltipWidth = tooltip.offsetWidth;
      const windowWidth = window.innerWidth;

      const rightEdge = mousePosition.x + 5 + tooltipWidth;
      let left = mousePosition.x + 5;

      if (rightEdge > windowWidth) {
        left = mousePosition.x - tooltipWidth - 5;
      }

      setTooltipPosition({
        left,
        top: mousePosition.y + 5,
      });
    }
  }, [mousePosition, isVisible, title]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={cn(styles.tooltip, className)}
            style={{
              left: tooltipPosition.left,
              top: tooltipPosition.top,
            }}
          >
            {title}
          </div>,
          document.body,
        )}
    </div>
  );
};
