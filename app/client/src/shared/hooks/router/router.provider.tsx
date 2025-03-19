import React, { useEffect } from "react";
import { RouterContext } from "./router.context";
import { useProxy } from "shared/hooks/proxy";
import { Event } from "shared/enums";
import { RoomComponent } from "modules/room";
import { useUpdate } from "@oh/pixi-components";
import { useRouterStore } from "./router.store";
import { HomeComponent } from "modules/home";

type RouterProps = {
  children?: React.ReactNode;
};

export const RouterProvider: React.FunctionComponent<RouterProps> = ({
  children,
}) => {
  const { update, lastUpdate } = useUpdate();
  const { on, emit } = useProxy();

  const { component: Component, navigate } = useRouterStore();

  useEffect(() => {
    const removeOnPreJoinRoom = on(Event.PRE_JOIN_ROOM, (data) => {
      emit(Event.JOIN_ROOM, { roomId: data.roomId });
    });
    const removeOnJoinRoom = on(Event.LOAD_ROOM, (data) => {
      navigate(RoomComponent);
      update();
    });

    return () => {
      removeOnPreJoinRoom();
      removeOnJoinRoom();
    };
  }, [on, emit, update, navigate]);

  return <RouterContext.Provider value={{}} children={<Component />} />;
};
