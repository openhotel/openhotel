import React, { useCallback } from "react";
import { getInternalVersion } from "shared/utils";
import { GITHUB_REPO_ISSUES_URL } from "shared/consts";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  GraphicsComponent,
  GraphicType,
  HorizontalAlign,
} from "@openhotel/pixi-components";
import { TextComponent } from "../text";

type Props = {
  title?: string;
  description?: string;
  issue?: number;
  type?: "TODO" | "BUG";
  priority?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  size?: number;
} & React.PropsWithChildren;

export const NoteComponent: React.FC<Props> = ({
  children,
  title,
  description,
  issue,
  priority,
  type,

  size = 6,
}) => {
  if (getInternalVersion() !== "development") return children;

  const onClickNote = useCallback(() => {
    let message = "Note >> ";
    if (type) message += `[${type}] `;
    if (priority) message += `(${priority}) `;
    if (title) message += title + " ";
    if (description) message += `'${description}' `;
    if (issue) message += `${GITHUB_REPO_ISSUES_URL}${issue} `;

    if (message === "Note ") return;
    console.debug(message);
  }, [title, description, issue, priority, type]);

  return (
    <ContainerComponent
      sortableChildren={true}
      eventMode={EventMode.STATIC}
      cursor={Cursor.HELP}
      onPointerDown={onClickNote}
    >
      <ContainerComponent zIndex={Number.MAX_SAFE_INTEGER}>
        <GraphicsComponent
          type={GraphicType.CIRCLE}
          radius={size + 2}
          tint={0}
        />
        <GraphicsComponent
          type={GraphicType.CIRCLE}
          radius={size}
          tint={0xff00ff}
          position={{ x: 2, y: 2 }}
        />
        <TextComponent
          text="N"
          position={{ x: (size + 2) / 2, y: (size + 2) / 2 }}
          pivot={{ x: -2, y: -2 }}
          horizontalAlign={HorizontalAlign.CENTER}
          tint={0}
        />
      </ContainerComponent>
      {children}
    </ContainerComponent>
  );
};
