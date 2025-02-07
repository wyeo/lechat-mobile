import { createContext, useContext, useState } from "react";

import UserUploadMediaType from "types/UserUploadMediaType";
import type { ActionButtonType } from "components/Chat/ActionButton";

type UserChatMessageRequest = {
  chatId: string;
  message: string;
  selectedActions: ActionButtonType[];
  selectedImages: UserUploadMediaType[];
  selectedDocuments: UserUploadMediaType[];
};

export const ChatContext = createContext<{
  pendingMessage: UserChatMessageRequest | null;
  resetPendingMessage: () => void;
  updatePendingMessage: (message: UserChatMessageRequest) => void;
}>({
  pendingMessage: null,
  resetPendingMessage: () => {},
  updatePendingMessage: () => {},
});

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pendingMessage, setPendingMessage] =
    useState<UserChatMessageRequest | null>(null);

  function updatePendingMessage(val: UserChatMessageRequest) {
    setPendingMessage(val);
  }

  function resetPendingMessage() {
    setPendingMessage(null);
  }

  return (
    <ChatContext.Provider
      value={{ pendingMessage, resetPendingMessage, updatePendingMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
