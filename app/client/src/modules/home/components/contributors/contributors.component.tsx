import React, { useCallback, useEffect, useRef, useState } from "react";
import { TickerQueue } from "@oh/queue";
import { CONTRIBUTOR_LOOP_TIME, TEXT_PADDING } from "shared/consts";
import { Cursor, EventMode } from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";
import { useContributors, useTasks } from "shared/hooks";

export const ContributorsComponent: React.FC = () => {
  const { getContributors, getCreators } = useContributors();
  const { add: addTask } = useTasks();

  const creatorIndexRef = useRef<number>(0);
  const contributorIndexRef = useRef<number>(0);

  const [text, setText] = useState<string>();

  const onOpenGithub = useCallback(() => {
    window.open("https://github.com/openhotel", "_blank");
  }, []);

  const doLoop = useCallback(() => {
    const creators = getCreators();
    const contributors = getContributors();

    if (creators.length > creatorIndexRef.current) {
      setText(`Created by ${creators[creatorIndexRef.current].login}`);
      creatorIndexRef.current++;
    } else if (contributors.length > contributorIndexRef.current) {
      setText(
        `Developed by ${contributors[contributorIndexRef.current].login}`,
      );
      contributorIndexRef.current++;
    }
    if (contributorIndexRef.current >= contributors.length) {
      creatorIndexRef.current = 0;
      contributorIndexRef.current = 0;
    }
  }, [getCreators, getContributors]);

  useEffect(() => {
    doLoop();
    return addTask({
      type: TickerQueue.REPEAT,
      repeatEvery: CONTRIBUTOR_LOOP_TIME,
      repeats: Number.MAX_SAFE_INTEGER,
      onFunc: doLoop,
    });
  }, [setText, doLoop, addTask]);

  return (
    <TextComponent
      text={text}
      padding={TEXT_PADDING}
      backgroundColor={1}
      backgroundAlpha={0.25}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
      onPointerDown={onOpenGithub}
    />
  );
};
