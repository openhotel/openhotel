import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PrivateRoomComponent } from "./private-room.component";
import { RoomPoint } from "shared/types";
import { CrossDirection } from "shared/enums";
import {
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@openhotel/pixi-components";

export default {
  title: "Shared/Rooms/Private",
  component: PrivateRoomComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PrivateRoomComponent>;

type Story = StoryObj<typeof PrivateRoomComponent>;

//@ts-ignore
export const Primary: Story = () => {
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

  return (
    <PrivateRoomComponent
      {...{
        type: "private",
        version: 1,
        id: "test",
        title: "Room 1",
        description: `Test`,
        layout: layout.map((line) =>
          line
            .split("")
            .map(
              (value) =>
                (parseInt(value) ? parseInt(value) : value) as RoomPoint,
            ),
        ),
        spawnPoint: { x: 0, z: 5, y: 0 },
        spawnDirection: CrossDirection.NORTH,
        furniture: [],
        maxUsers: 10,
        ownerId: "test",
        ownerUsername: "test",
        users: [],
      }}
      onPointerTile={console.log}
    />
  );
};

//@ts-ignore
export const Simple: Story = () => {
  const layout = [
    "x1111111",
    "x1111111",
    "x1111111",
    "s1111111",
    "x1111111",
    "x1111111",
    "x1111111",
  ];

  return (
    <PrivateRoomComponent
      {...{
        type: "private",
        version: 1,
        id: "test",
        title: "Room 1",
        description: `Test`,
        layout: layout.map((line) =>
          line
            .split("")
            .map(
              (value) =>
                (parseInt(value) ? parseInt(value) : value) as RoomPoint,
            ),
        ),
        spawnPoint: { x: 0, z: 5, y: 0 },
        spawnDirection: CrossDirection.NORTH,
        furniture: [],
        maxUsers: 10,
        ownerId: "test",
        ownerUsername: "test",
        users: [],
      }}
      onPointerTile={console.log}
    />
  );
};

//@ts-ignore
export const Stairs: Story = () => {
  const layout = [
    "xxxxxxxx11",
    "xxxxxxxx11",
    "xxxxsxxx11",
    "x111111111",
    "x111111111",
    "x222222222",
    "x222222222",
    "x333333333",
    "x333333333",
    "x444444444",
    "x444444444",
    "x555555555",
    "x555555555",
    "x666666666",
    "x666666666",
    "x777777777",
    "x777777777",
    "x777777777",
    "x777777777",
  ];

  return (
    <PrivateRoomComponent
      {...{
        type: "private",
        version: 1,
        id: "test",
        title: "Room 1",
        description: `Test`,
        layout: layout.map((line) =>
          line
            .split("")
            .map(
              (value) =>
                (parseInt(value) ? parseInt(value) : value) as RoomPoint,
            ),
        ),
        spawnPoint: { x: 0, z: 5, y: 0 },
        spawnDirection: CrossDirection.NORTH,
        furniture: [],
        maxUsers: 10,
        ownerId: "test",
        ownerUsername: "test",
        users: [],
      }}
      onPointerTile={console.log}
    />
  );
};

//@ts-ignore
export const Stairs1: Story = () => {
  const layout = [
    "xxxxxxxx11",
    "xxxxxxxx11",
    "xxxxsxxx11",
    "x111111111",
    "x111111111",
    "x222222222",
    "x222222222",
    "x333333333",
    "x333333333",
  ];

  return (
    <FlexContainerComponent
      justify={FLEX_JUSTIFY.CENTER}
      align={FLEX_ALIGN.CENTER}
    >
      <PrivateRoomComponent
        {...{
          type: "private",
          version: 1,
          id: "test",
          title: "Room 1",
          description: `Test`,
          layout: layout.map((line) =>
            line
              .split("")
              .map(
                (value) =>
                  (parseInt(value) ? parseInt(value) : value) as RoomPoint,
              ),
          ),
          spawnPoint: { x: 0, z: 5, y: 0 },
          spawnDirection: CrossDirection.NORTH,
          furniture: [],
          maxUsers: 10,
          ownerId: "test",
          ownerUsername: "test",
          users: [],
        }}
        onPointerTile={console.log}
      />
    </FlexContainerComponent>
  );
};

//@ts-ignore
export const RoomLayout: Story = () => {
  const layout = [
    "xxx11111",
    "xxs11111",
    "xxx11111",
    "xxx11111",
    "xxx22222",
    "xxx22222",
    "22222222",
    "22222222",
    "22222222",
    "22222222",
  ];

  return (
    <PrivateRoomComponent
      {...{
        type: "private",
        version: 1,
        id: "test",
        title: "Room 1",
        description: `Test`,
        layout: layout.map((line) =>
          line
            .split("")
            .map(
              (value) =>
                (parseInt(value) ? parseInt(value) : value) as RoomPoint,
            ),
        ),
        spawnPoint: { x: 0, z: 5, y: 0 },
        spawnDirection: CrossDirection.NORTH,
        furniture: [],
        maxUsers: 10,
        ownerId: "test",
        ownerUsername: "test",
        users: [],
      }}
      onPointerTile={console.log}
    />
  );
};
