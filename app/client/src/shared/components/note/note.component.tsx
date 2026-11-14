import React, { useCallback } from "react";
import { getInternalVersion } from "shared/utils";
import { GITHUB_REPO_ISSUES_URL } from "shared/consts";
import {
  ContainerComponent,
  Cursor,
  EventMode,
} from "@openhotel/pixi-components";
import { TextComponent } from "../text";
import { Point2d } from "../../types";

type Props = {
  title?: string;
  description?: string;
  issue?: number;
  type?: "TODO" | "BUG";
  priority?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  position?: Point2d;
} & React.PropsWithChildren;

export const NoteComponent: React.FC<Props> = ({
  children,
  title,
  description,
  issue,
  priority,
  type,

  position,
}) => {
  if (getInternalVersion() !== "development") return children;

  const onClickNote = useCallback(
    (e) => {
      const url = `${GITHUB_REPO_ISSUES_URL}${issue}`;
      if (e.ctrlKey) {
        window.open(url, "_blank");
        return;
      }
      let message = "Note >> ";
      if (type) message += `[${type}] `;
      if (priority) message += `(${priority}) `;
      if (title) message += title + " ";
      if (description) message += `'${description}' `;
      if (issue) message += `${url} `;

      if (message === "Note ") return;
      console.debug(message);
    },
    [title, description, issue, priority, type],
  );

  return (
    <ContainerComponent
      sortableChildren={true}
      eventMode={EventMode.STATIC}
      cursor={Cursor.HELP}
      onPointerDown={onClickNote}
      position={position}
    >
      <ContainerComponent zIndex={Number.MAX_SAFE_INTEGER}>
        <TextComponent
          text={`#${issue}`}
          position={{ x: 1, y: 1 }}
          backgroundColor={0}
          backgroundAlpha={1}
          padding={{
            bottom: 1,
            left: 3,
            right: 3,
            top: 3,
          }}
          tint={0xff00ff}
        />
      </ContainerComponent>
      {children}
    </ContainerComponent>
  );
};
