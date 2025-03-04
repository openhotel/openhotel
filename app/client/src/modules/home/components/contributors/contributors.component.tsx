import React, { useCallback, useEffect, useRef, useState } from "react";
import { System } from "system";
import { TickerQueue } from "@oh/queue";
import { CONTRIBUTOR_LOOP_TIME } from "shared/consts";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { TextComponent } from "shared/components";
import { Contributor } from "shared/types";

export const ContributorsComponent: React.FC = () => {
  const creatorIndexRef = useRef<number>(0);
  const contributorIndexRef = useRef<number>(0);

  const [creators] = useState<Contributor[]>(System.contributors.getCreators());
  const [contributors] = useState<Contributor[]>(
    System.contributors.getContributors(),
  );

  const [text, setText] = useState<string>();

  const doLoop = useCallback(() => {
    if (creators.length > creatorIndexRef.current) {
      setText(`Created by ${creators[creatorIndexRef.current].login}`);
      creatorIndexRef.current++;
    } else if (contributors.length > contributorIndexRef.current) {
      setText(
        `Contributed by ${contributors[contributorIndexRef.current].login}`,
      );
      contributorIndexRef.current++;
    }
    if (contributorIndexRef.current >= contributors.length) {
      creatorIndexRef.current = 0;
      contributorIndexRef.current = 0;
    }
  }, [creators, contributors]);

  useEffect(() => {
    doLoop();
    return System.tasks.add({
      type: TickerQueue.REPEAT,
      repeatEvery: CONTRIBUTOR_LOOP_TIME,
      repeats: Number.MAX_SAFE_INTEGER,
      onFunc: doLoop,
    });
  }, [setText, doLoop]);

  return (
    <ContainerComponent
      pivot={{
        x: -10,
        y: 55,
      }}
    >
      <FlexContainerComponent align={FLEX_ALIGN.BOTTOM}>
        <TextComponent
          text={text}
          padding={{
            right: 0,
            left: 6,
            top: 3,
          }}
          backgroundColor={1}
          backgroundAlpha={0.45}
        />
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
