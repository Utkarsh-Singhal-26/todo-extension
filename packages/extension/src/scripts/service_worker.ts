interface Todo {
  id: string;
  title: string;
  column: string;
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.message === "SYNC_TODOS") {
    console.log(
      "Background Script: Received SYNC_TODOS request with data:",
      request.todos
    );
    syncTodos(request.todos);
    sendResponse({ status: "success" });
  } else if (request.message === "GET_TODOS") {
    chrome.storage.sync.get("todos", (data) => {
      sendResponse({ todos: data.todos || [] });
    });
    return true;
  }
});

function syncTodos(todos: Todo[]) {
  chrome.storage.sync.set({ todos }, () => {
    if (chrome.runtime.lastError) {
      console.error(
        "Background Script: Error setting todos in chrome.storage.sync:",
        chrome.runtime.lastError
      );
      return;
    }
    console.log("Saved to the chrome.strorage.sync API:", todos);
  });
}
