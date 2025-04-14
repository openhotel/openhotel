import { TextComponent } from "shared/components/text";
import { TEXT_BACKGROUND_BASE } from "shared/consts";
import {
  Event,
  EventMode,
  FLEX_ALIGN,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  useEvents,
  useSystem,
} from "@openhotel/pixi-components";
import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useConfig, useRouter } from "shared/hooks";
import { Hemisphere, Route } from "shared/enums";

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
  const system = useSystem();

  const [fps, setFps] = useState<number>(0);

  useEffect(() => {
    const onRemoveFPS = on(Event.FPS, setFps);

    return () => {
      onRemoveFPS();
    };
  }, [on, setFps]);

  const route = useMemo(() => Route[getRoute()], [getRoute]);
  const hemisphere = useMemo(() => getAccount().hemisphere, [getAccount]);
  const version = useMemo(() => getVersion(), [getVersion]);

  return (
    <FlexContainerComponent
      align={FLEX_ALIGN.BOTTOM}
      zIndex={Number.MAX_SAFE_INTEGER}
      direction="y"
      pivot={{
        x: 6,
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
