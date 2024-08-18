const setStorage = (key: string, value: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "SET_STORAGE", key, value },
      (response: { status: string }) => {
        if (response.status === "success") {
          resolve();
        } else {
          reject(new Error("Failed to set storage"));
        }
      }
    );
  });
};

const getStorage = (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "GET_STORAGE", key },
      (response: { data: any }) => {
        if (response.data !== undefined) {
          resolve(response.data);
        } else {
          reject(new Error("Failed to get storage"));
        }
      }
    );
  });
};

export { setStorage, getStorage };
