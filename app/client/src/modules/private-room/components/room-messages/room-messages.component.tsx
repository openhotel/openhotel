import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Event as OhEvent,
  useEvents,
  useWindow,
} from "@openhotel/pixi-components";
import { useAccount, usePrivateRoom, useProxy, useTasks } from "shared/hooks";
import { Event } from "shared/enums";
import { RoomMessage, Size2d } from "shared/types";
import { getPositionFromIsometricPosition } from "shared/utils";
import { BubbleMessageComponent } from "shared/components";
import {
  BUBBLE_MESSAGE_HEIGHT,
  CHAT_BUBBLE_MESSAGE_INTERVAL,
  MIN_SAFE_MESSAGES,
} from "shared/consts";
import { ulid } from "ulidx";
import { TickerQueue } from "@oh/queue";

type Props = {} & ContainerProps;

export const RoomMessagesComponent: React.FC<Props> = ({
  ...containerProps
}) => {
  const { on } = useEvents();
  const { getSize } = useWindow();
  const { on: onProxy } = useProxy();
  const { getAccount } = useAccount();
  const { room, getUser } = usePrivateRoom();
  const { add: addTask } = useTasks();

  const [maxMessages, setMaxMessages] = useState<number>(MIN_SAFE_MESSAGES);
  const [messages, setMessages] = useState<RoomMessage[]>([]);

  const currentAccount = useMemo(() => getAccount(), [getAccount]);

  const addMessage = useCallback(
    (messageData: Partial<RoomMessage>) => {
      const currentUser = getUser({
        accountId: messageData.accountId ?? currentAccount.accountId,
      });

      const position = getPositionFromIsometricPosition(currentUser.position);

      const message: RoomMessage = {
        ...messageData,
        username: messageData.username ?? currentUser?.username ?? "",
        position: {
          x: position.x,
          y: 0,
        },
        visible: false,
      } as RoomMessage;

      setMessages(($messages) => [message, ...$messages]);
    },
    [setMessages, getUser, currentAccount, maxMessages],
  );

  useEffect(() => {
    if (!room) return;

    const removeOnMessage = onProxy(
      Event.MESSAGE,
      ({ id, accountId, message, color }) => {
        addMessage({
          id,
          accountId,
          message,
          color,
        });
      },
    );

    const removeOnWhisperMessage = onProxy(
      Event.WHISPER_MESSAGE,
      ({ id, accountId, message, color }) =>
        addMessage({
          id,
          accountId,
          message,
          color,
          backgroundColor: 0xc1bfbf,
        }),
    );

    const removeOnSystemMessage = onProxy(
      Event.SYSTEM_MESSAGE,
      ({ message }) => {
        addMessage({
          id: ulid(),
          accountId: null,
          username: "System",
          message,
          color: 0xffffff,
          backgroundColor: 0xdba935,
          messageColor: 0xffffff,
        });
        console.log(`System: ${message}`);
      },
    );

    return () => {
      removeOnMessage();
      removeOnWhisperMessage();
      removeOnSystemMessage();
    };
  }, [room, addMessage, getUser, onProxy]);

  const onResize = useCallback(
    (size: Size2d) => {
      setMaxMessages(
        Math.max(
          MIN_SAFE_MESSAGES,
          Math.round(Math.round(size.height / 4) / BUBBLE_MESSAGE_HEIGHT),
        ),
      );
    },
    [setMaxMessages],
  );

  useEffect(() => {
    const removeOnResize = on(OhEvent.RESIZE, onResize);

    onResize(getSize());

    return () => {
      removeOnResize();
    };
  }, [on, getSize]);

  const [yPivot, setYPivot] = useState<number>(0);

  useEffect(() => {
    if (!messages.filter(Boolean).length) return;

    let removeTransitionTask;
    const removeDelayTask = addTask({
      type: TickerQueue.DELAY,
      delay: CHAT_BUBBLE_MESSAGE_INTERVAL,
      onDone: () => {
        removeTransitionTask = addTask({
          type: TickerQueue.DURATION,
          duration: 500,
          onFunc: (delta) => {
            setYPivot((y) =>
              y >= BUBBLE_MESSAGE_HEIGHT
                ? BUBBLE_MESSAGE_HEIGHT
                : y + delta / 10,
            );
          },
          onDone: () => {
            setYPivot(0);
            setMessages(($messages) => {
              return [null, ...$messages].slice(0, maxMessages);
            });
          },
        });
      },
    });

    let removeInitialTransitionTask;
    if (messages.some((message) => message && !message.visible)) {
      setYPivot(-BUBBLE_MESSAGE_HEIGHT);
      removeInitialTransitionTask = addTask({
        type: TickerQueue.DURATION,
        duration: 500,
        onFunc: (delta) => {
          setYPivot((y) => (y >= 0 ? 0 : y + delta / 10));
        },
        onDone: () => {
          setYPivot(0);
          setMessages(($messages) =>
            $messages.map((message) =>
              message ? { ...message, visible: true } : message,
            ),
          );
        },
      });
    }

    return () => {
      removeDelayTask();
      removeTransitionTask?.();
      removeInitialTransitionTask?.();
    };
  }, [messages, setMessages, maxMessages, addTask, setYPivot]);

  return (
    <ContainerComponent
      {...containerProps}
      pivot={{
        ...containerProps?.pivot,
        y: (containerProps?.pivot?.y ?? 0) + yPivot,
      }}
    >
      {messages.map((messageData, index) => {
        if (!messageData) return null;
        const {
          id,
          username,
          message,
          backgroundColor,
          color,
          messageColor,
          position,
        } = messageData;
        return (
          <BubbleMessageComponent
            key={id}
            username={username}
            message={message}
            position={{
              x: position.x,
              y: (maxMessages - index - 1) * BUBBLE_MESSAGE_HEIGHT,
            }}
            backgroundColor={backgroundColor}
            usernameColor={color}
            borderColor={color}
            messageColor={messageColor}
            align="center"
          />
        );
      })}
    </ContainerComponent>
  );
};
