/** SERVICE WORKER */

/**
 * In this file we:
 * 1. Set up the appSettings state in chrome.storage
 * 2. Send a message to all relevant tabs on an onChange event
 */

import { initialAppSettings, APP_MAPPINGS } from "./appSettingsConfig";

/**
 * Installation Logic
 */
chrome.runtime.onInstalled.addListener(async () => {
  // check if there is an appState in chrome storage
  const result = await chrome.storage.local.get("appSettings");
  if (!result.appSettings) {
    try {
      await chrome.storage.local.set({ appSettings: initialAppSettings });
    } catch (error) {
      console.log("Error in initializing settings on installation:", error);
    }
  }
});

/**
 * When new tab is activated:
 * 1. Make sure appSettings is always defined. Reset if someone tinkered with it
 * 2. Update the selectedPage
 */
chrome.tabs.onActivated.addListener(async () => {
  try {
    const result = await chrome.storage.local.get("appSettings");
    if (!result.appSettings) {
      await chrome.storage.local.set({ appSettings: initialAppSettings });
    }

    const { appSettings } = result;

    // Get the active tab
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!activeTab || !activeTab.url) return;

    try {
      const { hostname, pathname } = new URL(activeTab.url);
      const app = APP_MAPPINGS[hostname] ? APP_MAPPINGS[hostname].app : null;

      // If the URL does not correspond to a supported app
      if (!app) {
        console.log("Active tab is not a supported app:", hostname);
        return;
      }
      const { appSettings } = result;
      const updatedLastSelectedPage = APP_MAPPINGS[hostname].pages[pathname];
      appSettings.generalSettings.lastSelectedPage = updatedLastSelectedPage;
      await chrome.storage.local.set({ appSettings });
    } catch (urlError) {
      console.error("Error parsing URL of active tab:", urlError);
    }
  } catch (error) {
    console.log("Error when new tab is activated:", error);
  }
});

/**
 * When a tab is reloaded, update the lastSelectedPage
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

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
        // chrome.action.disable(); TODO: figure this one out
        return;
      }
      // chrome.action.enable();

      // Get the current App's state
      const result = await chrome.storage.local.get("appSettings");
      const appSettings = result.appSettings;

      // Update the state's last selected page to correspond to the URL's pathname
      const updatedLastSelectedPage = APP_MAPPINGS[hostname].pages[pathname];
      appSettings.generalSettings.lastSelectedPage = updatedLastSelectedPage;

      // Save the updated appState back to chrome's storage
      await chrome.storage.local.set({ appSettings });
    }
  } catch (error) {
    console.log("Error when new tab is reloaded/updated:", error);
  }
});

/**
 * Most important codeblock of background.js
 * Applying settings to all tabs anytime the settings within storage changes
 */
chrome.storage.onChanged.addListener(() => {
  chrome.windows.getAll((windows) => {
    windows.forEach((window) => {
      chrome.tabs.query({ windowId: window.id }, (tabs) => {
        tabs.forEach((tab) => {
          try {
            chrome.tabs.sendMessage(tab.id, "settingsUpdated");
          } catch (error) {
            console.error("Error sending message to tab", tab);

            // Handle potential disconnections gracefully
            // if (error.message === 'Could not establish connection. Receing end does not exist') {
            //   console.error('Could not connect to tab with ID:', tab.id);
            // } else {
            //   throw error;
            // }
          }
        });
      });
    });
  });
});
