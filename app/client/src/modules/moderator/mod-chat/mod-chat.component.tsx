import React, { useEffect, useState } from "react";
import {
  ContainerComponent,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
} from "@openhotel/pixi-components";
import { useModeration, useProxy } from "shared/hooks";
import { Event } from "shared/enums";
import { ScrollComponent, TextComponent } from "shared/components";
import { ulid } from "ulidx";
import dayjs from "dayjs";
import { User } from "shared/types";

type Props = {
  width?: number;
  height?: number;
  padding?: number;
  getUser: (data: { accountId?: string; username?: string }) => User | null;
};

export const ModChatComponent: React.FC<Props> = ({
  width = 250,
  height = 300,
  padding = 4,
  getUser,
}) => {
  const { on: onProxy } = useProxy();
  const { closeConsoleNow, clearConsoleNow, openConsoleNow } = useModeration();

  const [show, setShow] = useState<boolean>(false);

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!openConsoleNow) return;
    setShow(true);
  }, [openConsoleNow, setShow]);

  useEffect(() => {
    if (!closeConsoleNow) return;
    setShow(false);
  }, [closeConsoleNow, setShow]);

  useEffect(() => {
    if (!clearConsoleNow) return;
    setMessages([]);
  }, [clearConsoleNow, setMessages]);

  useEffect(() => {
    const removeOnSystemMessage = onProxy(
      Event.SYSTEM_MESSAGE,
      ({ message }) => {
        setMessages((messages) => [
          {
            id: ulid(),
            username: "System",
            message,
            timestamp: dayjs().format("HH:mm"),
          },
          ...messages,
        ]);
        setShow(true);
      },
    );
    const removeOnMessage = onProxy(
      Event.MESSAGE,
      ({ id, accountId, message, color }) => {
        setMessages((messages) => [
          {
            id,
            username: getUser({ accountId }).username,
            message,
            timestamp: dayjs().format("HH:mm"),
          },
          ...messages,
        ]);
      },
    );

    const removeOnWhisperMessage = onProxy(
      Event.WHISPER_MESSAGE,
      ({ id, accountId, message, color }) =>
        setMessages((messages) => [
          {
            id,
            username: getUser({ accountId }).username,
            message,
            timestamp: dayjs().format("HH:mm"),
          },
          ...messages,
        ]),
    );

    return () => {
      removeOnSystemMessage();
      removeOnMessage();
      removeOnWhisperMessage();
    };
  }, [onProxy, setMessages, setShow, getUser]);

  if (!show) return null;
  return (
    <ContainerComponent>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={width + padding * 2}
        height={height + padding * 2}
        tint={0}
        alpha={0.4}
      />
      <ScrollComponent
        position={{ x: padding, y: padding }}
        size={{ width, height }}
      >
        <FlexContainerComponent gap={2} direction="y" size={{ width }}>
          {messages.map(({ message, timestamp, username }, index) => (
            <TextComponent
              key={index}
              text={`- ${timestamp} [${username}]: ${message}`}
              tint={0xffffff}
              wrap
              maxWidth={width}
            />
          ))}
        </FlexContainerComponent>
      </ScrollComponent>
    </ContainerComponent>
  );
};
