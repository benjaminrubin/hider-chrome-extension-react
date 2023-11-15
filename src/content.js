chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "disconnectObserver") {
      mutationObserver.disconnect();
    }
  });
  