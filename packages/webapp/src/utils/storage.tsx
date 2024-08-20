// const setStorage = (key: string, value: any): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     console.log(key, value);
//     chrome.runtime.sendMessage(
//       { type: "SET_STORAGE", key, value },
//       (response: { status: string }) => {
//         if (response.status === "success") {
//           resolve();
//         } else {
//           reject(new Error("Failed to set storage"));
//         }
//       }
//     );
//   });
// };

// const getStorage = (key: string): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     chrome.runtime.sendMessage(
//       { type: "GET_STORAGE", key },
//       (response: { data: any }) => {
//         if (response.data !== undefined) {
//           resolve(response.data);
//         } else {
//           reject(new Error("Failed to get storage"));
//         }
//       }
//     );
//   });
// };

// export { setStorage, getStorage };

// export interface Storage {
//   get: (key: string, callback: (result: any) => void) => void;
//   set: (items: { [key: string]: any }, callback?: () => void) => void;
// }

// const isExtension =
//   typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id;

// const chromeStorage: Storage = {
//   get: (key, callback) => {
//     if (isExtension && chrome.storage && chrome.storage.sync) {
//       chrome.storage.sync.get(key, callback);
//     } else {
//       const result = localStorage.getItem(key);
//       callback({ [key]: result ? JSON.parse(result) : null });
//     }
//   },
//   set: (items: { [key: string]: any }, callback) => {
//     if (isExtension && chrome.storage && chrome.storage.sync) {
//       chrome.storage.sync.set(items, callback || (() => {}));
//     } else {
//       Object.keys(items).forEach((key) => {
//         localStorage.setItem(key, JSON.stringify(items[key]));
//       });
//       if (callback) callback();
//     }
//   },
// };

// export default chromeStorage;

// export const sendMessageToExtension = (message: any): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     console.log(message);
//     console.log(chrome.runtime);
//   });
// };

// interface Message {
//   type: string;
//   key?: string;
//   data?: any;
// }

// export const sendMessageToExtension = (message: Message): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     console.log(message);
//     console.log(chrome.runtime);
//     if (!chrome?.runtime?.id) {
//       console.error("This function must be called from a Chrome extension environment.");
//       reject("Not a Chrome extension environment.");
//       return;
//     }

//     chrome.runtime.sendMessage(message, (response) => {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError.message);
//       } else {
//         resolve(response);
//       }
//     });
//   });
// };
