import type { MessageInstance } from "antd/es/message/interface";

let globalMessage: MessageInstance | null = null;

export const setGlobalMessage = (messageApi: MessageInstance | null) => {
  globalMessage = messageApi;
};

export const notifyError = (content: string) => {
  if (globalMessage) {
    globalMessage.error(content);
    return;
  }
  console.error(content);
};
