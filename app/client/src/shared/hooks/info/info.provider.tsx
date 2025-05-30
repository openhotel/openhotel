import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { InfoContext } from "./info.context";
import { InfoComponent } from "shared/components";
import { Event, useEvents } from "@openhotel/pixi-components";
import { useInfoStore } from "./info.store";
import { useRouter } from "shared/hooks/router";

type InfoProps = {
  children: ReactNode;
};

export const InfoProvider: React.FunctionComponent<InfoProps> = ({
  children,
}) => {
  const { getRoute } = useRouter();
  const { on } = useEvents();

  const { setExtra, extra, clearExtra } = useInfoStore();

  const [showInfo, setShowInfo] = useState(
    localStorage.getItem("info") === "1",
  );

  useEffect(() => {
    clearExtra();
  }, [getRoute]);

  useEffect(() => {
    const removeOnKeyUp = on(Event.KEY_UP, ({ code }: KeyboardEvent) => {
      if (code !== "F1") return;

      setShowInfo((show) => {
        localStorage.setItem("info", show ? "0" : "1");
        return !show;
      });
    });
    return () => {
      removeOnKeyUp();
    };
  }, [on, setShowInfo]);

  const renderInfo = useMemo(
    () => (showInfo ? <InfoComponent extra={extra} /> : null),
    [showInfo, extra],
  );

  return (
    <InfoContext.Provider
      value={{
        setExtra,
        clearExtra,
      }}
      children={
        <>
          {renderInfo}
          {children}
        </>
      }
    />
  );
};
