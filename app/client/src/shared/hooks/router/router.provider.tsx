import React, { useEffect, useMemo } from "react";
import { RouterContext } from "./router.context";
import { useProxy } from "shared/hooks/proxy";
import { Event, Route } from "shared/enums";
import { useUpdate } from "@oh/pixi-components";
import { useRouterStore } from "./router.store";
import { HomeComponent } from "modules/home";
import { PrivateRoomComponent } from "modules/private-room";
import { useModal } from "shared/hooks";

type RouterProps = {};

export const RouterProvider: React.FunctionComponent<RouterProps> = () => {
  const { update } = useUpdate();
  const { on, emit } = useProxy();
  const { closeAll } = useModal();

  const { route, data, navigate } = useRouterStore();

  useEffect(() => {
    const removeOnPreJoinRoom = on(Event.PRE_JOIN_ROOM, ({ room }) => {
      emit(Event.JOIN_ROOM, { roomId: room.id });
    });
    const removeOnJoinRoom = on(Event.LOAD_ROOM, (data) => {
      navigate(Route.PRIVATE_ROOM, data);
      closeAll();
      update();
    });
    on(Event.LEAVE_ROOM, (data) => {
      navigate(Route.HOME);
      update();
    });

    return () => {
      removeOnPreJoinRoom();
      removeOnJoinRoom();
    };
  }, [on, emit, update, navigate]);

  const RouteComponent = useMemo(
    () =>
      ({
        [Route.HOME]: HomeComponent,
        [Route.PRIVATE_ROOM]: PrivateRoomComponent,
      })[route],
    [route],
  );

  return (
    <RouterContext.Provider
      value={{}}
      // @ts-ignore
      children={<RouteComponent {...data} />}
    />
  );
};
