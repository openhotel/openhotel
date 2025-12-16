import { useContext } from "react";
import { ChatContext, ChatState } from "shared/hooks/chat/chat.context.tsx";

export const useChat = (): ChatState => useContext(ChatContext);
