import React, { ReactNode } from "react";
import { ChatContext } from "./chat.context.tsx";
import { useChatStore } from "./chat.store.ts";

type ChatProps = {
  children: ReactNode;
};

export const ChatProvider: React.FunctionComponent<ChatProps> = ({
  children,
}) => {
  const { enabled, setEnabled } = useChatStore();

  return (
    <ChatContext.Provider
      value={{
        enabled,
        setEnabled,
      }}
      children={children}
    />
  );
};
