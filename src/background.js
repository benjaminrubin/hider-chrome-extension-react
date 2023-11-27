/** SERVICE WORKER */

/**
 * In this file we:
 * 1. Set up the appSettings state in chrome.storage
 * 2. Send a message to all relevant tabs on an onChange event
 */

import { initialAppSettings, APP_MAPPINGS } from './appSettingsConfig';

/**
 * Installation Logic
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log('we just installed');
  // check if there is an appState in chrome storage
  const result = await chrome.storage.local.get("appSettings");
  if (!result.appSettings) {
    await chrome.storage.local.set({ appSettings: initialAppSettings });
  }
});

/**
 * When new tab is activated:
 * 1. Make sure appSettings is always defined. Reset if someone tinkered with it
 * 2. Update the selectedPage
 */
chrome.tabs.onActivated.addListener(async () => {
  const result = await chrome.storage.local.get("appSettings");
  if (!result.appSettings) {
    await chrome.storage.local.set({ appSettings: initialAppSettings });
  } else {

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    // Return if we are in an irregular (i.e. settings) tab
    if (!tabs[0]) return;

    // Skip if not in a supported URL or the app does not match the URL
    const currentURL = tabs[0].url;
    const url = new URL(currentURL);

    const hostname = url.hostname;
    const pathname = url.pathname;
    const app = APP_MAPPINGS[hostname] ? APP_MAPPINGS[hostname].app : null;

    // If the URL does not correspond to a supported app
    if (!app) {
      console.log('This is not a supported app. we are disabling the action item')
      // chrome.action.disable();
      return;
    }
    // chrome.action.enable();

    const { appSettings } = result;
    const updatedLastSelectedPage = APP_MAPPINGS[hostname].pages[pathname];
    appSettings.generalSettings.lastSelectedPage = updatedLastSelectedPage;
    await chrome.storage.local.set({ appSettings });
  }
});

/**
 * When a tab is reloaded, update the lastSelectedPage
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
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
});

/**
 * Most important codeblock of background.js
 * Applying settings to all tabs anytime the settings within storage changes
 */
chrome.storage.onChanged.addListener(async (changes, _) => {

  // Verify that appSettings is set
  const appSettings = await chrome.storage.local.get("appSettings");
  if (!Object.keys(appSettings).length) {
    await chrome.storage.local.set({ appSettings: initialAppSettings });
  }
  console.log('Changes to chrome.storage:', changes);

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, 'settingsUpdated');
    });
  });
});