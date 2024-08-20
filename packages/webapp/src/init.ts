interface EventCallbackMap {
  [key: string]: Function;
}

interface MessageListeners {
  [key: string]: Function[];
}

interface PageScriptMessageHandler {
  eventCallbackMap: EventCallbackMap;
  messageListeners: MessageListeners;
  requestId: number;

  constants: {
    SOURCE: string;
    DOMAIN: string;
  };

  handleMessageReceived: (event: MessageEvent) => void;
  messageHandler: (event: MessageEvent) => void;
  init: () => void;
}

export const PageScriptMessageHandler: PageScriptMessageHandler = {
  eventCallbackMap: {},
  messageListeners: {},
  requestId: 1,

  constants: {
    SOURCE: "page_script",
    DOMAIN: window.location.origin,
  },

  handleMessageReceived: function (message: MessageEvent) {
    console.log("Message received", message);
    this.messageHandler(message);
  },

  messageHandler: function (message: MessageEvent) {
    const messageListener = this.messageListeners[message.type];
    console.log(messageListener);

    // if (messageListener) {
    //   const response = messageListener(message);

    //   if (response) {
    //     this.sendResponse(message, response);
    //   }
    // }
  },

  init: function () {
    window.addEventListener("message", this.handleMessageReceived.bind(this));
  },
};
