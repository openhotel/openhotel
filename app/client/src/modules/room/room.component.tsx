import React from "react";
import { PrivateRoomComponent } from "shared/components";
import { RoomPoint } from "shared/types";
import { CrossDirection } from "shared/enums";
import {
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { useAccount } from "shared/hooks";

export const RoomComponent: React.FC = () => {
  const { getAccount } = useAccount();

  const layout = [
    "xxxxxx2222",
    "xxxxxx2222",
    "xxxxxx2222",
    "x111122222",
    "x111122222",
    "s111122222",
    "x111122222",
    "x22x2x2222",
    "x22x3x2222",
    "x2233xxxxx",
    "xxxx33333x",
    "x33333333x",
    "x33333333x",
    "x33333333x",
  ];

  const data = {
    type: "private",
    version: 1,
    id: "test",
    title: "Room 1",
    description: `Test`,
    layout: layout.map((line) =>
      line
        .split("")
        .map(
          (value) => (parseInt(value) ? parseInt(value) : value) as RoomPoint,
        ),
    ),
    spawnPoint: { x: 0, z: 5, y: 0 },
    spawnDirection: CrossDirection.NORTH,
    furniture: [],
    maxUsers: 10,
    ownerId: "test",
    ownerUsername: "test",
  };

  return (
    <FlexContainerComponent
      justify={FLEX_JUSTIFY.CENTER}
      align={FLEX_ALIGN.CENTER}
    >
      <PrivateRoomComponent {...data} />
    </FlexContainerComponent>
  );
};
