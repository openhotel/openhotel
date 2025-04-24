import { TextComponent } from "shared/components/text";
import { TEXT_BACKGROUND_BASE } from "shared/consts";
import {
  Event,
  EventMode,
  FLEX_ALIGN,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  Size,
  useEvents,
  useSystem,
} from "@openhotel/pixi-components";
import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useConfig, useRouter, useSafeWindow } from "shared/hooks";
import { Hemisphere, InternalEvent, Route } from "shared/enums";

const Text = ({ text }) => (
  <TextComponent
    text={text}
    eventMode={EventMode.NONE}
    {...TEXT_BACKGROUND_BASE}
  />
);
const Line = () => (
  <GraphicsComponent
    type={GraphicType.RECTANGLE}
    width={100}
    height={4}
    tint={0}
    alpha={0}
    eventMode={EventMode.NONE}
  />
);

type Props = {
  extra: string[];
};

export const InfoComponent: React.FC<Props> = ({ extra = [] }) => {
  const { on } = useEvents();
  const { getRoute } = useRouter();
  const { getAccount } = useAccount();
  const { getVersion } = useConfig();
  const { getSafeSize, getSafeXPosition } = useSafeWindow();
  const system = useSystem();

  const [fps, setFps] = useState<number>(0);
  const [safeWindowSize, setSafeWindowSize] = useState<Size>(getSafeSize());
  const [safeXPosition, setSafeXPosition] =
    useState<number>(getSafeXPosition());

  useEffect(() => {
    const onRemoveFPS = on(Event.FPS, setFps);
    const onWindowSize = on(InternalEvent.SAFE_POSITION_X, setSafeXPosition);
    const onSafeWindowSize = on(InternalEvent.SAFE_RESIZE, setSafeWindowSize);

    return () => {
      onRemoveFPS();
      onWindowSize();
      onSafeWindowSize();
    };
  }, [on, setFps, setSafeWindowSize, setFps, setSafeXPosition]);

  const route = useMemo(() => Route[getRoute()], [getRoute]);
  const hemisphere = useMemo(() => getAccount().hemisphere, [getAccount]);
  const version = useMemo(() => getVersion(), [getVersion]);

  return (
    <FlexContainerComponent
      align={FLEX_ALIGN.BOTTOM}
      zIndex={Number.MAX_SAFE_INTEGER}
      size={{
        width: safeWindowSize.width,
      }}
      direction="y"
      pivot={{
        x: 6 + safeXPosition,
        y: -5,
      }}
    >
      <Text text={`${fps} FPS`} />
      <Line />
      <Text text={version} />
      <Line />
      <Text text={`${system.browser.name} (${system.browser.version})`} />
      <Text text={`${system.cpu.arch} (x${system.cpu.cores})`} />
      <Text text={`${system.gpu.name} (${system.gpu.vendor})`} />
      <Line />
      <Text text={`hem: ${Hemisphere[hemisphere]}`} />
      <Text text={`route: ${route}`} />
      {extra.length ? (
        <>
          <Line />
          <Text text="///////////////////////" />
          <Line />
          {extra.map((text, index) =>
            text ? (
              <Text key={`${index}_${text}`} text={text} />
            ) : (
              <Line key={`${index}`} />
            ),
          )}
        </>
      ) : null}
    </FlexContainerComponent>
  );
};
