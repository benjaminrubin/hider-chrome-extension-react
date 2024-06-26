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

export const PAGE_NOT_SUPPORTED = 'page-not-supported';

// The Master App Settings
export const initialAppSettings = {
  generalSettings: {
    isAppSupported: true, // <-- TODO: Incorporate logic for this
    lastSelectedApp: APPS.YOUTUBE,
    lastSelectedPage: PAGES[APPS.YOUTUBE].HOME_PAGE,
    darkModeOn: false,
  },
  youtube: {
    pageSettings: {
      homePage: {
        label: "Home Page",
        path: "/",
        pageLayoutClassName: "home-page",
        pageElements: {
          mainLayout: ["navigation", "sidebar", "videos"],
          other: ["homeShorts", "thumbnails", "youtubePlayables"],
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
          other: ["live-chat", "videoShorts", "thumbnails", "end-cards"],
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
      videoShorts: {
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
      homeShorts: {
        label: "Shorts",
        isShown: true,
        isLocked: false,
        selectors: ['[aria-label="Shorts"]', '[title="Shorts"]', "[is-shorts]"],
      },
      "end-cards": {
        label: "Video End Cards",
        isShown: true,
        isLocked: false,
        selectors: [".ytp-ce-element"],
      },
      irrelevantResults: {
        label: "Irrelevant Search Results",
        isShown: true,
        isLocked: false,
        selectors: ["ytd-shelf-renderer[modern-typography]", "ytd-horizontal-card-list-renderer"],
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
      youtubePlayables: {
        label: "Playables & Breaking News",
        isShown: true,
        isLocked: false,
        selectors:["ytd-rich-section-renderer"]
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
 * Checks whether a webpage is supported by the app
 * If valid, returns the correct page
 * If not valid, returns page not supported
 */

const getPageType = (url) => {
  try {
    const { hostname, pathname } = new URL(url);
    const appMapping = APP_MAPPINGS[hostname];
    
    if (appMapping) {
      const page = appMapping.pages[pathname];
      if (page) {
        return page;
      }
    }
    return PAGE_NOT_SUPPORTED;
  } catch (error) {
    console.error("Error parsing URL in isValidPage:", error);
    return PAGE_NOT_SUPPORTED;
  }
}



/**
 * Installation Logic
 */
chrome.runtime.onInstalled.addListener(async () => {
  try {
    // check if there is an appState in chrome storage
    const result = await chrome.storage.sync.get("appSettings");

    if (result.appSettings) {
      const existingSettings = result.appSettings;
      const mergedSettings = { ...initialAppSettings, ...existingSettings };

      // Recursively merge nested objects
      const deepMerge = (target, source) => {
        for (const key in source) {
          if (source[key] instanceof Object) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
          }
        }
        Object.assign(target || {}, source);
        return target;
      };

      const finalSettings = deepMerge(initialAppSettings, mergedSettings);

      await chrome.storage.sync.set({ appSettings: finalSettings });
    } else {
      // If there are no existing settings, set the initial settings
      await chrome.storage.sync.set({ appSettings: initialAppSettings });
    }
  } catch (error) {
    console.log("Error in initializing settings on installation:", error);
  }

});

/**
 * When new tab is activated:
 * 1. Make sure appSettings is always defined. Reset if someone tinkered with it
 * 2. Update the selected page, if the hostname isn't youtube.com, then set selectedPage to empty string
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

    // If there is no active tab, or this is not a regular webpage return
    if (!activeTab || !activeTab.url) return;

    try {
      appSettings.generalSettings.lastSelectedPage = getPageType(activeTab.url);

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
  // if (changeInfo.status === "complete") {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // wait for tab to finish loading
      if (changeInfo.status === "complete") { 
        // Get the current appSettings state
        const result = await chrome.storage.sync.get("appSettings");
        const appSettings = result.appSettings || initialAppSettings;

        appSettings.generalSettings.lastSelectedPage = getPageType(tab.url);

        // Save the updated appState back to chrome's storage
        await chrome.storage.sync.set({ appSettings });
      }
    } catch (error) {
      console.log("Error when new tab is reloaded/updated:", error);
    }
  // }
});

/**
 * When clicking on the chrome action icon, make sure
 * to update the currently selected app
 */
chrome.action.onClicked.addListener(async (tabId, changeInfo, tab) => {
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

      // If the current pathname (page) does not correlate to one of the main pathnames
      const lastSelectedPage = Object.keys(APP_MAPPINGS[hostname].pages).includes(pathname) ?
      APP_MAPPINGS[hostname]?.pages[pathname]
      // Set the page as not supported
        : PAGE_NOT_SUPPORTED;
      
      appSettings.generalSettings.lastSelectedPage = lastSelectedPage;

      await chrome.storage.sync.set({ appSettings });
    } catch (urlError) {
      console.error("Error parsing URL of current tab:", urlError);
    }
  } catch (error) {
    console.log("Error when action icon is clicked:", error);
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
