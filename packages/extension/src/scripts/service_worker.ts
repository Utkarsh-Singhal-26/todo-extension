chrome.runtime.onMessage.addListener(
  (
    message: { type: string; key?: string; value?: any },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    console.log(sender);
    if (message.type === "GET_STORAGE" && message.key) {
      chrome.storage.sync.get(message.key, (result) => {
        if (message.key !== undefined) {
          sendResponse({ data: result[message.key] });
        }
      });
      return true;
    } else if (
      message.type === "SET_STORAGE" &&
      message.key !== undefined &&
      message.value !== undefined
    ) {
      chrome.storage.sync.set({ [message.key]: message.value }, () => {
        sendResponse({ status: "success" });
      });
      return true;
    }
  }
);
