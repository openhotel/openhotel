import React, { useEffect } from "react";
import { NavigatorRoomButtonComponent } from "shared/components";
import {
  FLEX_JUSTIFY,
  FlexContainerComponent,
  Size,
} from "@oh/pixi-components";
import { ModalNavigatorTabProps } from "shared/types";
import { System } from "system";

type Props = {
  size: Size;

  rooms: {
    id: string;
    title: string;
    users: number;
    maxUsers: number;
    favorite: boolean;
  }[];

  onClickFavorite: (roomId: string) => void;
  onClickGo: (roomId: string) => void;
};

export const CategoryRoomsComponent: React.FC<ModalNavigatorTabProps> = ({
  size,
}) => {
  useEffect(() => {
    System.api
      .fetch<{
        rooms: {
          id: string;
          title: string;
          description: string;
          userCount: number;
          maxUsers: number;
        }[];
      }>("/room-list", {
        type: "private",
      })
      .then((data) => {
        console.log(data);
      });
  }, []);

  return <CategoryRoomsComponentWrapper size={size} rooms={[]} />;
};

export const CategoryRoomsComponentWrapper: React.FC<Props> = ({
  size,
  rooms,
  onClickGo,
  onClickFavorite,
}) => {
  return (
    <FlexContainerComponent justify={FLEX_JUSTIFY.START} direction="y" gap={3}>
      {rooms.map(({ id, title, users, maxUsers, favorite }, index) => (
        <NavigatorRoomButtonComponent
          key={id}
          size={{
            width: size.width,
            height: 16,
          }}
          title={title}
          users={users}
          maxUsers={maxUsers}
          favorite={favorite}
          onClickFavorite={() => onClickFavorite(id)}
          onClickGo={() => onClickGo(id)}
        />
      ))}
    </FlexContainerComponent>
  );
};
