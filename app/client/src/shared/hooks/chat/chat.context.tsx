import React from "react";

export type ChatState = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export const ChatContext = React.createContext<ChatState>(undefined);
