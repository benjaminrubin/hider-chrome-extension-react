/** SERVICE WORKER */

import { ELEMENT_STATE, ELEMENT_STATE_ACTION } from "./GlobalUtils";
import { initialAppState } from "./state/AppStateReducer.jsx";

const YOUTUBE_URL = "www.youtube.com";
const TIKTOK_URL = "www.tiktok.com";

const APP_MAPPINGS = {
  [YOUTUBE_URL]: {
    app: "youtube",
    pages: {
      "/watch": "video_page",
      "/results": "search_page",
      "/": "home_page",
    },
  },
  [TIKTOK_URL]: {
    app: "tiktok",
    pages: {},
  },
};

// Verify url is valid and matching to the app
export const doesAppMatchUrl = (app, url) => {
  console.log("what is the url?", url);
  for (const domain in APP_MAPPINGS) {
    if (url.includes(domain) && APP_MAPPINGS[domain].app === app) {
      return true;
    }
  }
  return false;
};

const TOGGLE_FUNCTION_TYPE = {
  STATIC: "static",
  DYNAMIC: "dynamic",
};

const getToggleFunctionType = (element) => {
  let toggleFunctionType;
  switch (element) {
    case "homeShorts":
    case "searchShorts":
      toggleFunctionType = TOGGLE_FUNCTION_TYPE.DYNAMIC;
      break;
    default:
      toggleFunctionType = TOGGLE_FUNCTION_TYPE.STATIC;
  }
  return toggleFunctionType;
};

/**
 * Installation Logic
 */
chrome.runtime.onInstalled.addListener(async () => {
  // check if there is an appState in chrome storage
  const appState = await chrome.storage.local.get("appState");
  if (!appState || appState.version !== "1") {
    await chrome.storage.local.set({ appState: initialAppState });
  }
});

/**
 * Action Message Receival Logic
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  console.log("tabs", tabs[0]);

  // Return if we are in an irregular (i.e. settings) tab
  if (!tabs[0]) return;

  // Skip if not in a supported URL or the app does not match the URL
  console.log('This tabs[0] which should show a url is always giving me shit:', tabs[0]);
  const currentURL = tabs[0].url;
  console.log("currentURL is", currentURL);
  if (!doesAppMatchUrl(message.app, currentURL)) {
    return;
  }

  // Retrieve the details of the message from popup
  const { app, element, action } = message;

  // Determine the toggleFunctionType (static/dynamic)
  const toggleFunctionType = getToggleFunctionType(element);

  // Send a message to content.js
  const response = await chrome.tabs.sendMessage(tabs[0].id, {
    app,
    element,
    action,
    toggleFunctionType,
  });

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
});

/**
 * When new tab is activated:
 * 1. Apply layout style updates
 * 2. Switch the "lastSelectedState.lastSelectedPage" state so that the popup loads the correct page for the user on activation
 */
chrome.tabs.onActivated.addListener(async () => {

  console.log('Tab is activated')

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  // Return if we are in an irregular (i.e. settings) tab
  if (!tabs[0]) return;

  // Skip if not in a supported URL or the app does not match the URL
  const currentURL = tabs[0].url;
  const url = new URL(currentURL);
  console.log("url is", url); // TODO: REMOVE THIS LINE
  const hostname = url.hostname;
  const pathname = url.pathname;
  const app = APP_MAPPINGS[hostname] ? APP_MAPPINGS[hostname].app : null;

  // If the URL does not correspond to a supported app
  if (!app) {
    return;
  }

  // Get the current App's state
  const result = await chrome.storage.local.get("appState");
  const appState = result.appState;

  // Retrieve all app-related page layout elements
  const pageLayoutElements = appState[app];

  // For each element send a message to content
  Object.entries(pageLayoutElements).forEach(
    async ([element, { state: elementDisplayState }]) => {
      // Determine the action based on the state
      const action =
        elementDisplayState === ELEMENT_STATE.DISPLAYED
          ? ELEMENT_STATE_ACTION.SHOW
          : ELEMENT_STATE_ACTION.HIDE;

      // Determine the toggleFunctionType (static/dynamic)
      const toggleFunctionType = getToggleFunctionType(element);

      // Send a message to content.js
      const response = await chrome.tabs.sendMessage(tabs[0].id, {
        app,
        element,
        action,
        toggleFunctionType,
      });
    }
  );

  // Update the state's last selected page to correspond to the URL's pathname
  const updatedLastSelectedPage = APP_MAPPINGS[hostname].pages[pathname];
  appState.lastSelectedState.lastSelectedPage = updatedLastSelectedPage;

  // Save the updated appState back to chrome's storage
  await chrome.storage.local.set({ appState });
});

/**
 * When a tab is reloaded, fetch and apply the styling
 * to the layout based on storage values
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  console.log("tab is reloading", changeInfo.status);

  // wait for tab to finish loading
  if (changeInfo.status === "complete") {
    // Skip if not in a supported URL or the app does not match the URL
    const currentURL = tabs[0].url;
    const url = new URL(currentURL);

    const hostname = url.hostname;
    const pathname = url.pathname;
    const app = APP_MAPPINGS[hostname] ? APP_MAPPINGS[hostname].app : null;

    // If the URL does not correspond to a supported app
    if (!app) {
      return;
    }

    // Get the current App's state
    const result = await chrome.storage.local.get("appState");
    const appState = result.appState;

    // Retrieve all app-related page layout elements
    const pageLayoutElements = appState[app];

    // For each element send a message to content
    Object.entries(pageLayoutElements).forEach(
      async ([element, elementData]) => {

        console.log('Element is', element);
        console.log('Element data is', elementData);

        // Determine the action based on the state
        const action =
          elementData.state === ELEMENT_STATE.DISPLAYED
            ? ELEMENT_STATE_ACTION.SHOW
            : ELEMENT_STATE_ACTION.HIDE;

        if (action === ELEMENT_STATE_ACTION.HIDE) {
          // Determine the toggleFunctionType (static/dynamic)
          const toggleFunctionType = getToggleFunctionType(element);

          const response = await chrome.tabs.sendMessage(tabs[0].id, {
            app,
            element,
            action,
            toggleFunctionType,
          });
        }
      }
    );

    // Update the state's last selected page to correspond to the URL's pathname
    const updatedLastSelectedPage = APP_MAPPINGS[hostname].pages[pathname];
    appState.lastSelectedState.lastSelectedPage = updatedLastSelectedPage;

    // Save the updated appState back to chrome's storage
    await chrome.storage.local.set({ appState });
  }
});