import { Message } from "@ai-sdk/react";
import { Attachment } from "@ai-sdk/ui-utils";

type ChatMessageType = {
  id?: string;
  chatId?: string;
  content: string;
  role: Message["role"];
  attachments?: Attachment[];
};

export default ChatMessageType;
