interface TodoEvent extends MessageEvent {
  data: {
    type: string;
    todos?: {
      id: string;
      title: string;
      column: string;
    };
  };
}

interface ChromeResponse {
  todos?: {
    id: string;
    title: string;
    column: string;
  };
}

window.addEventListener("message", (event: TodoEvent) => {
  if (event.source !== window) return;

  if (event.data.type === "SYNC_TODOS") {
    try {
      chrome.runtime.sendMessage(
        {
          message: "SYNC_TODOS",
          todos: event.data.todos,
        },
        (response: ChromeResponse) =>
          window.postMessage({ type: "FROM_EXTENSION", data: response }, "*")
      );
    } catch (error) {
      console.error("Failed to send message to the background script:", error);
    }
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "SYNC_TODOS") {
    window.postMessage({ type: "FROM_EXTENSION", todos: request.todos }, "*");
  }
});

try {
  chrome.runtime.sendMessage(
    { message: "GET_TODOS" },
    (response: ChromeResponse) => {
      if (response.todos) {
        window.postMessage(
          { type: "FROM_EXTENSION", todos: response.todos },
          "*"
        );
      }
    }
  );
} catch (error) {
  console.error("Failed to retrieve todos from the background script:", error);
}
