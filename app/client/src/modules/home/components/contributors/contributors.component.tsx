import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TickerQueue } from "@oh/queue";
import { CONTRIBUTOR_LOOP_TIME, TEXT_BACKGROUND_BASE } from "shared/consts";
import { Cursor, EventMode } from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";
import { useContributors, useTasks } from "shared/hooks";
import { useTranslation } from "react-i18next";

export const ContributorsComponent: React.FC = () => {
  const { t } = useTranslation();
  const { getContributors, getCreators } = useContributors();
  const { add: addTask } = useTasks();

  const creatorIndexRef = useRef<number>(0);
  const contributorIndexRef = useRef<number>(0);

  const [text, setText] = useState<string>(`${t("system.created_by")} ...`);

  const onOpenGithub = useCallback(() => {
    window.open("https://github.com/openhotel", "_blank");
  }, []);

  const doLoop = useCallback(() => {
    const creators = getCreators();
    const contributors = getContributors();

    if (!creators.length || !contributors.length) return;

    if (creators.length > creatorIndexRef.current) {
      console.log(creatorIndexRef.current, creators);
      setText(
        `${t("system.created_by")} ${creators[creatorIndexRef.current].login}`,
      );
      creatorIndexRef.current++;
    } else if (contributors.length > contributorIndexRef.current) {
      setText(
        `${t("system.developed_by")} ${contributors[contributorIndexRef.current].login}`,
      );
      contributorIndexRef.current++;
    }
    if (contributorIndexRef.current >= contributors.length) {
      creatorIndexRef.current = 0;
      contributorIndexRef.current = 0;
    }
  }, [getCreators, getContributors, t]);

  useEffect(() => {
    doLoop();
    return addTask({
      type: TickerQueue.REPEAT,
      repeatEvery: CONTRIBUTOR_LOOP_TIME,
      repeats: Number.MAX_SAFE_INTEGER,
      onFunc: doLoop,
    });
  }, [setText, doLoop, addTask]);

  return useMemo(
    () => (
      <TextComponent
        text={text}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onOpenGithub}
        {...TEXT_BACKGROUND_BASE}
      />
    ),
    [text, onOpenGithub],
  );
};
