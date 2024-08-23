import React, { FormEvent, useRef } from "react";
import { getColorFromSeed } from "shared/utils";
import styles from "./animations.module.scss";

type Props = {
  frames: string[];
  animations: Record<string, string[]>;
  setAnimations: (animations: Record<string, string[]>) => void;
};

export const AnimationsComponent: React.FC<Props> = ({
  frames,
  animations: animationsObject = {},
  setAnimations,
}) => {
  const nameFrameRef = useRef();

  const onAddAnimation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const name = data.get("name") as string;

    if (!name) return;

    setAnimations({
      ...animationsObject,
      [name]: [],
    });
    //@ts-ignore
    event.target.reset();
    //@ts-ignore
    nameFrameRef.current.focus();
  };

  const onAddAnimationFrame =
    (animationKey: string) => async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const frame = data.get("frame") as string;

      if (!frame) return;

      setAnimations({
        ...animationsObject,
        [animationKey]: [
          ...new Set([...animationsObject[animationKey], frame]),
        ],
      });
      //@ts-ignore
      event.target.reset();
    };

  const onDeleteAnimation = (animationKey: string) => () => {
    const clonedAnimationsObject = { ...animationsObject };

    delete clonedAnimationsObject[animationKey];
    setAnimations(clonedAnimationsObject);
  };

  const onDeleteAnimationFrame =
    (animationKey: string, spriteName: string) => () => {
      const clonedAnimationsObject = { ...animationsObject };

      clonedAnimationsObject[animationKey] = clonedAnimationsObject[
        animationKey
      ].filter((frame) => spriteName !== frame);
      setAnimations(clonedAnimationsObject);
    };

  const animations = Object.keys(animationsObject).map<
    [string, string[], string]
  >((frameKey) => [
    frameKey,
    animationsObject[frameKey],
    getColorFromSeed(frameKey),
  ]);

  return (
    <div className={styles.animations}>
      <span>animations:</span>
      {animations.map(([animationKey, animations, color]) => (
        <div
          key={animationKey}
          className={styles.frame}
          style={{ backgroundColor: color }}
        >
          <label title={animationKey}>{animationKey}</label>
          <div className={styles.sprites}>
            {animations.map((spriteName) => (
              <div className={styles.sprite} key={spriteName}>
                <span>{spriteName}</span>
                <button
                  onClick={onDeleteAnimationFrame(animationKey, spriteName)}
                >
                  -
                </button>
              </div>
            ))}
            <form
              className={styles.frame}
              onSubmit={onAddAnimationFrame(animationKey)}
            >
              <select name="frame">
                {frames
                  .filter((frame) => !animations.includes(frame))
                  .map((frame) => (
                    <option key={frame} value={frame}>
                      {frame}
                    </option>
                  ))}
              </select>
              <button>+</button>
            </form>
          </div>
          <button
            className={styles.action}
            onClick={onDeleteAnimation(animationKey)}
          >
            delete
          </button>
        </div>
      ))}
      <form className={styles.frame} onSubmit={onAddAnimation}>
        <input ref={nameFrameRef} name="name" placeholder="name" />
        <button>+</button>
      </form>
    </div>
  );
};
