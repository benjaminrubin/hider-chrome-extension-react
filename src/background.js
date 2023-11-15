/** SERVICE WORKER */

import { ELEMENT_STATE, ELEMENT_STATE_ACTION } from "./GlobalUtils";
import { initialAppState } from "./state/AppStateReducer.jsx";

const YOUTUBE_URL = "www.youtube.com";

const APP_MAPPINGS = {
  "www.youtube.com": {
    app: "youtube",
    pages: {
      "/watch": "video_page",
      "/results": "search_page",
      "/": "home_page",
    },
  },
  "www.tiktok.com": {
    app: "tiktok",
    pages: {},
  },
};

const PAGE_ELEMENT_SELECTORS = {
  youtube: {
    navigation: ["masthead-container"],
    player: ["player"],
    "title-and-description": ["above-the-fold"],
    comments: ["comments"],
    recommendations: ["related", "items"],
    "live-chat": ["chat-container"],
    homeShorts: [],
    searchShorts: [],
    videos: ["primary"],
    sidebar: ["guide-content"],
    results: ["page-manager"],
  },
  results: {},
  home: {},
  tiktok: {
    url: "www.tiktok.com",
  },
};

// When extension is installed
chrome.runtime.onInstalled.addListener(async () => {
  // check if there is an appState in chrome storage
  const appState = await chrome.storage.local.get("appState");
  if (!appState || appState.version !== "1") {
    await chrome.storage.local.set({ appState: initialAppState });
  }
});

// When a message is received from the Popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const { app, element, action } = message;

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  let toggleFunction;

  /** 
   * Dictate the appropriate toggleFunction script to execute
   * 1. Static elements need to be queried one time
   * 2. Dynamic elements (those that appear while scrolling) need to be continuously queried
  */
  switch (element) {
    case 'homeShorts':
    case 'searchShorts':
      toggleFunction = dynamicToggleLayoutElement;
      break;
    default:
      toggleFunction = toggleLayoutElement;
  }

  if (tabs[0]) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: toggleFunction,
        args: [app, element, action, JSON.stringify(PAGE_ELEMENT_SELECTORS)],
      });
    } catch (error) {
      console.error("Error executing the script within onMessage:", error);
    }

    // Update chrome's storage
    chrome.storage.local.get("appState", async (result) => {
      let newAppState = result.appState;

      // Check if appState is not undefined, if it is, use the initial appState
      if (!newAppState) {
        newAppState = initialAppState;
      }

      // Update the specific element's state within appState
      try {
        const updatedState =
          action === ELEMENT_STATE_ACTION.HIDE
            ? ELEMENT_STATE.HIDDEN
            : ELEMENT_STATE.DISPLAYED;
        newAppState[app][element].state = updatedState;
      } catch (error) {
        console.error("Error updating the app state:", error);
      }

      // Save the updated appState back to chrome's storage
      await chrome.storage.local.set({ appState: newAppState });
    });
  }
});

/**
 * This function toggles the display of static elements on the webpage
 * via executing a script
 */
function toggleLayoutElement(app, element, action, serializedElementSelectors) {
  const elementSelectors = JSON.parse(serializedElementSelectors);
  const pageElementIds = elementSelectors[app][element];

  if (pageElementIds && pageElementIds.length > 0) {
    for (const elementId of pageElementIds) {
      // for (let i = 0; i < pageElementIds.length; i++) {
      // const elementId = pageElementIds[i];
      const element = document.getElementById(elementId);
      const currentDisplayValue = window.getComputedStyle(element).display;

      switch (action) {
        case "show":
          if (currentDisplayValue === "none") {
            element.style.display = "";
          }
          break;
        case "hide":
          if (currentDisplayValue !== "none") {
            element.style.display = "none";
          }
          break;
        default:
          "";
      }
    }
  }
}

/**
 * This function accommodates for dynamic elements that appear as the user
 * scrolls down the webpage. Using the mutationObserver, we are listening
 * for elements that appear and check if they meet our criteria for toggling
 */
function dynamicToggleLayoutElement(app, element, action, serializedElementSelectors) {
  const elementSelectors = JSON.parse(serializedElementSelectors);
  
  const targetInnerText = {
    homeShorts: { innerText: 'shorts', selector: '#dismissible'},
    searchShorts: {innerText:'shorts', selector: 'ytd-reel-shelf-renderer'},
    peopleAlsoWatched: 'people also watched'
  }


  // Function to compare innerText, case-insensitive
  const matchesInnerText = (el, text) => {
    return el.innerText.toLowerCase().includes(text.toLowerCase());
  };

   // Function to apply styles to an element based on action
   const applyStyleToElement = (el) => {
    if (matchesInnerText(el, targetInnerText[element].innerText)) {
      el.style.display = action === "hide" ? "none" : "";
    }
   };
  
  // Find and apply styles to existing dismissible elements
  const existingDismissibles = document.querySelectorAll(targetInnerText[element].selector);
  existingDismissibles.forEach(applyStyleToElement);
  
  // Mutation Observer callback 
  const mutationObserverCallback = (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.id === 'dismissible') {
          applyStyleToElement(node);
        }
      });
    });
  };
  
  // Create a Mutation Observer to observe for dynamically added dismissible elements
  const mutationObserver = new MutationObserver(mutationObserverCallback);
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

/**
 * When new tab is activated:
 * 1. Apply layout style updates
 * 2. Switch the "lastSelectedState.lastSelectedPage" state
 */
chrome.tabs.onActivated.addListener(() => {
  // Query for the current tab
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (tabs) {
      // The first tab is the current tab
      const tab = tabs[0];

      if (tab.url) {
        try {
          // Retrieve the current URL
          const url = new URL(tab.url);
          const hostname = url.hostname;
          const pathname = url.pathname;

          if (hostname.includes(YOUTUBE_URL)) {
            // Get the stored state from chrome.storage
            const result = await chrome.storage.local.get("appState");
            const appState = result.appState;
            const app = APP_MAPPINGS[YOUTUBE_URL].app;

            // Get all the relevent layout elements on the current page
            const pageLayoutElements = appState.youtube;

            // Update page's layout styles
            Object.entries(pageLayoutElements).forEach(
              ([element, { state: elementDisplayState }]) => {
                // Determine the action based on the state
                const action =
                  elementDisplayState === ELEMENT_STATE.DISPLAYED
                    ? ELEMENT_STATE_ACTION.SHOW
                    : ELEMENT_STATE_ACTION.HIDE;

                console.log("The toggle action is", action);

                chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  func: toggleLayoutElement,
                  args: [
                    app,
                    element,
                    action,
                    JSON.stringify(PAGE_ELEMENT_SELECTORS),
                  ],
                });
              }
            );

            // Update the lastSelectedPage value
            appState.lastSelectedState.lastSelectedPage =
              APP_MAPPINGS[hostname].pages[pathname];
            await chrome.storage.local.set({ appState });
          }
        } catch (error) {
          console.error("There was an error:", error);
        }
      }
    }
  });
});

/**
 * When a tab is reloaded, fetch and apply the styling
 * to the layout based on storage values
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // If the status is complete
  if (changeInfo.status === "complete") {
    try {
      // Retrieve the current URL
      const url = new URL(tab.url);
      const hostname = url.hostname;
      const pathname = url.pathname;

      if (hostname.includes(YOUTUBE_URL)) {
        // Get the stored state from chrome.storage
        const result = await chrome.storage.local.get("appState");
        const appState = result.appState;
        const app = APP_MAPPINGS[YOUTUBE_URL].app;

        // Get all the relevent layout elements on the current page
        const pageLayoutElements = appState.youtube;

        // Update page's layout styles
        Object.entries(pageLayoutElements).forEach(
          ([element, { state: elementDisplayState }]) => {
            // Determine the action based on the state
            const action =
              elementDisplayState === ELEMENT_STATE.DISPLAYED
                ? ELEMENT_STATE_ACTION.SHOW
                : ELEMENT_STATE_ACTION.HIDE;

            console.log("The toggle action is", action);

            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: toggleLayoutElement,
              args: [
                app,
                element,
                action,
                JSON.stringify(PAGE_ELEMENT_SELECTORS),
              ],
            });
          }
        );

        // Update the lastSelectedPage value
        appState.lastSelectedState.lastSelectedPage =
          APP_MAPPINGS[hostname].pages[pathname];
        await chrome.storage.local.set({ appState });
      }
    } catch (error) {
      console.error("There was an error:", error);
    }
  }
});


/**
 * Managing Resources - disconnecting the observer
 */
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.active) {
//     // Check if the new URL is relevant for the observer
//     if (!isRelevantUrl(tab.url)) {
//       // Send a message to content script to disconnect the observer
//       chrome.tabs.sendMessage(tabId, { action: "disconnectObserver" });
//     }
//   }
// });

// chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
//   // Send a message to content script to disconnect the observer
//   // (You might need to keep track of which tabs have active observers)
//   chrome.tabs.sendMessage(tabId, { action: "disconnectObserver" });
// });
