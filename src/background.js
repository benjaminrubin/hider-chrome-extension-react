/** SERVICE WORKER */

/**
 * In this file we:
 * 1. Set up the appSettings state in chrome.storage
 * 2. Send a message to all relevant tabs on an onChange event
 */

export const APPS = {
  YOUTUBE: "youtube",
};

export const PAGES = {
  [APPS.YOUTUBE]: {
    HOME_PAGE: "home-page",
    VIDEO_PAGE: "video-page",
    SEARCH_PAGE: "search-page",
  },
};

// Setting up state
export const initialAppSettings = {
  generalSettings: {
    isAppSupported: true,
    lastSelectedApp: APPS.YOUTUBE,
    lastSelectedPage: PAGES[APPS.YOUTUBE].HOME_PAGE,
  },
  youtube: {
    pageSettings: {
      homePage: {
        label: "Home Page",
        path: "/",
        pageLayoutClassName: "home-page",
        pageElements: {
          mainLayout: ["navigation", "sidebar", "videos"],
          other: ["homeShorts", "thumbnails"],
        },
      },
      videoPage: {
        label: "Video Page",
        path: "/watch",
        pageLayoutClassName: "video-page",
        pageElements: {
          mainLayout: [
            "navigation",
            "player",
            "title-and-description",
            "comments",
            "recommendations",
          ],
          other: ["live-chat", "thumbnails"],
        },
      },
      searchPage: {
        label: "Search Page",
        path: "/results",
        pageLayoutClassName: "search-page",
        pageElements: {
          mainLayout: ["navigation", "sidebar", "results"],
          other: ["searchShorts", "thumbnails", "irrelevantResults"],
        },
      },
    },
    elementsSettings: {
      navigation: {
        label: "Navigation",
        isShown: true,
        isLocked: false,
        selectors: ["#masthead-container"],
      },
      player: {
        label: "▶",
        isShown: true,
        isLocked: false,
        selectors: ["#player"],
      },
      "title-and-description": {
        label: "Title and Description",
        isShown: true,
        isLocked: false,
        selectors: ["#above-the-fold"],
      },
      comments: {
        label: "Comments",
        isShown: true,
        isLocked: false,
        selectors: ["ytd-comments", "ytm-comment-section-renderer"],
      },
      recommendations: {
        label: "Recs",
        isShown: true,
        isLocked: false,
        selectors: ["#related", "#items"],
      },
      "live-chat": {
        label: "Live Chat",
        isShown: true,
        isLocked: false,
        selectors: ["#chat-container"],
      },
      videos: {
        label: "Videos",
        isShown: true,
        isLocked: false,
        selectors: ["#contents", "#header"],
      },
      homeShorts: {
        label: "Shorts",
        isShown: true,
        isLocked: false,
        selectors: ['[aria-label="Shorts"]', '[title="Shorts"]', "[is-shorts]"],
      },
      irrelevantResults: {
        label: "Irrelevant Search Results",
        isShown: true,
        isLocked: false,
        selectors: ["ytd-shelf-renderer[modern-typography]"],
      },
      searchShorts: {
        label: "Shorts",
        isShown: true,
        isLocked: false,
        selectors: [
          '[aria-label="Shorts"]',
          '[title="Shorts"]',
          "[is-shorts]",
          "ytd-reel-shelf-renderer",
        ],
      },
      sidebar: {
        label: "Sidebar",
        isShown: true,
        isLocked: false,
        selectors: ["#guide-content", "ytd-mini-guide-renderer"],
      },
      results: {
        label: "Results",
        isShown: true,
        isLocked: false,
        selectors: ["#page-manager"],
      },
      thumbnails: {
        label: "Thumbnails",
        isShown: true,
        isLocked: false,
        selectors: [
          "ytd-thumbnail",
          "ytd-playlist-thumbnail",
          "#thumbnail",
          "#thumbnail-container",
          ".shelf-skeleton",
          ".thumbnail",
          ".ytp-videowall-still-image",
        ],
        additionalCss: `
        .metadata.ytd-compact-video-renderer {
          padding-right: 0 !important;
        }
        .shelf-skeleton .video-skeleton {
          margin-right: 4px;
        }`,
      },
    },
  },
};

export const YOUTUBE_URL = "www.youtube.com";
export const TIKTOK_URL = "www.tiktok.com";

export const APP_MAPPINGS = {
  [YOUTUBE_URL]: {
    app: "youtube",
    pages: {
      "/watch": "videoPage",
      "/results": "searchPage",
      "/": "homePage",
    },
  },
  [TIKTOK_URL]: {
    app: "tiktok",
    pages: {},
  },
};

/**
 * Installation Logic
 */
chrome.runtime.onInstalled.addListener(async () => {
  // for (const cs of chrome.runtime.getManifest().content_scripts) {
  //   console.log('cs is', cs)
  //   for (const tab of await chrome.tabs.query({ url: cs.matches })) {

  //     try {
  //       console.log('tab is', tab);

  //       chrome.scripting.executeScript({
  //         target: {tabId: tab.id},
  //         files: cs.js,
  //       });
  //     } catch (error) {
  //       console.error("Having an error injecting into page", error);
  //     }
  //   }
  // }

  // check if there is an appState in chrome storage
  const result = await chrome.storage.sync.get("appSettings");
  if (!result.appSettings) {
    try {
      await chrome.storage.sync.set({ appSettings: initialAppSettings });
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
    const result = await chrome.storage.sync.get("appSettings");
    if (!result.appSettings) {
      await chrome.storage.sync.set({ appSettings: initialAppSettings });
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
        appSettings.generalSettings.isAppSupported = false;
      } else {
        appSettings.generalSettings.isAppSupported = true;
        const updatedLastSelectedPage = APP_MAPPINGS[hostname].pages[pathname];
        appSettings.generalSettings.lastSelectedPage = updatedLastSelectedPage;
      }
      await chrome.storage.sync.set({ appSettings });
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
  if (changeInfo.status === "complete") {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // wait for tab to finish loading
      if (changeInfo.status === "complete") {
        // Skip if not in a supported URL or the app does not match the URL
        const url = new URL(tab.url);
        const hostname = url.hostname;
        const pathname = url.pathname;

        // Check if the URL corresponds to a supported app
        const app = APP_MAPPINGS[hostname] ? APP_MAPPINGS[hostname].app : null;

        // Get the current appSettings state
        const result = await chrome.storage.sync.get("appSettings");
        const appSettings = result.appSettings || initialAppSettings;

        // If the URL does not correspond to a supported app
        if (!app) {
          appSettings.generalSettings.isAppSupported = false;
        } else {
          appSettings.generalSettings.isAppSupported = true;

          // Update the state's last selected page to correspond to the URL's pathname
          const updatedLastSelectedPage =
            APP_MAPPINGS[hostname].pages[pathname];
          appSettings.generalSettings.lastSelectedPage =
            updatedLastSelectedPage;
        }

        // Save the updated appState back to chrome's storage
        await chrome.storage.sync.set({ appSettings });
      }
    } catch (error) {
      console.log("Error when new tab is reloaded/updated:", error);
    }
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
          // Verify the tab contains an injected content script
          if (tab.url.match("https://.*.youtube.com/.*")) {
            try {
              chrome.tabs.sendMessage(tab.id, "settingsUpdated");
            } catch (error) {
              console.error("Error sending message to tab", tab);
            }
          }
        });
      });
    });
  });
});
