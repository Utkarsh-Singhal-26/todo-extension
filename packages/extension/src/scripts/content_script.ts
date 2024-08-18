chrome.runtime.onMessage.addListener(
  (
    message: { type: string; key?: string; value?: any },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    console.log(sender);
    if (message.type === "GET_STORAGE" || message.type === "SET_STORAGE") {
      chrome.runtime.sendMessage(message, sendResponse);
      return true;
    }
  }
);
