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
    SUBSCRIPTIONS_PAGE: "subscriptions-page",
  },
};

export const PAGE_NOT_SUPPORTED = "page-not-supported";

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
        label: "Home",
        path: "/",
        pageLayoutClassName: "home-page",
        pageElements: {
          mainLayout: ["navigation", "sidebar", "videos"],
          other: ["homeShorts", "homeThumbnails", "youtubePlayables"],
        },
      },
      videoPage: {
        label: "Video",
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
          other: ["live-chat", "videoShorts", "videoThumbnails", "end-cards"],
        },
      },
      searchPage: {
        label: "Search",
        path: "/results",
        pageLayoutClassName: "search-page",
        pageElements: {
          mainLayout: ["navigation", "sidebar", "results"],
          other: ["searchShorts", "searchThumbnails", "irrelevantResults"],
        },
      },
      subscriptionsPage: {
        label: "Subscriptions",
        path: "/feed/subscriptions",
        pageLayoutClassName: "subscriptions-page",
        pageElements: {
          mainLayout: ["navigation", "sidebar", "videos"],
          other: ["subscriptionsShorts", "subscriptionsThumbnails"],
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
        label: "Shorts (Video)",
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
        label: "Shorts (Home)",
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
        selectors: [
          "ytd-shelf-renderer[modern-typography]",
          "ytd-horizontal-card-list-renderer",
        ],
      },
      searchShorts: {
        label: "Shorts (Search)",
        isShown: true,
        isLocked: false,
        selectors: [
          '[aria-label="Shorts"]',
          '[title="Shorts"]',
          "[is-shorts]",
          "ytd-reel-shelf-renderer",
        ],
      },
      subscriptionsShorts: {
        label: "Shorts (Subscriptions)",
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
        selectors: ["ytd-rich-section-renderer"],
      },
      homeThumbnails: {
        label: "Thumbnails (Home)",
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
          ".ShortsLockupViewModelHostThumbnailContainer",
        ],
        additionalCss: `
        .metadata.ytd-compact-video-renderer {
          padding-right: 0 !important;
        }
        .shelf-skeleton .video-skeleton {
          margin-right: 4px;
        }`,
      },
      searchThumbnails: {
        label: "Thumbnails (Search)",
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
          ".ShortsLockupViewModelHostThumbnailContainer",
          "#hero-image",
        ],
        additionalCss: `
        .metadata.ytd-compact-video-renderer {
          padding-right: 0 !important;
        }
        .shelf-skeleton .video-skeleton {
          margin-right: 4px;
        }`,
      },
      subscriptionsThumbnails: {
        label: "Thumbnails (Subscriptions)",
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
          ".ShortsLockupViewModelHostThumbnailContainer",
        ],
        additionalCss: `
        .metadata.ytd-compact-video-renderer {
          padding-right: 0 !important;
        }
        .shelf-skeleton .video-skeleton {
          margin-right: 4px;
        }`,
      },
      videoThumbnails: {
        label: "Thumbnails (Video)",
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
          ".ShortsLockupViewModelHostThumbnailContainer",
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

export const APP_MAPPINGS = {
  [YOUTUBE_URL]: {
    app: "youtube",
    pages: {
      "/watch": "videoPage",
      "/results": "searchPage",
      "/": "homePage",
      "/feed/subscriptions": "subscriptionsPage",
    },
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
      // Exact match first
      const page = appMapping.pages[pathname];
      if (page) {
        return page;
      }

      // console.log("pathname is", pathname);

      // Pattern matching or generic handling (adjust logic as needed)
      if (pathname.startsWith("/feed/")) {
        return "subscriptionsPage"; // Or any other desired logic
      }

      // Other pattern matching or default handling
    }

    return PAGE_NOT_SUPPORTED;
  } catch (error) {
    console.error("Error parsing URL in getPageType:", error);
    return PAGE_NOT_SUPPORTED;
  }
};

/**
 * This function fixes selectors that should be arrays but are objects
 * for both Thumbnails and Shorts related elements
 */
function fixObjectSelectors(settings) {
  if (settings.youtube && settings.youtube.elementsSettings) {
    Object.keys(settings.youtube.elementsSettings).forEach((key) => {
      if (key.endsWith("Thumbnails") || key.endsWith("Shorts")) {
        const element = settings.youtube.elementsSettings[key];
        if (
          element.selectors &&
          typeof element.selectors === "object" &&
          !Array.isArray(element.selectors)
        ) {
          // Convert object to array
          element.selectors = Object.values(element.selectors);
        }
      }
    });
  }
  return settings;
}

/**
 * This function fixes the typo in subscriptionsPage pageElements
 */
function fixSubscriptionsShorts(settings) {
  if (
    settings.youtube &&
    settings.youtube.pageSettings &&
    settings.youtube.pageSettings.subscriptionsPage &&
    settings.youtube.pageSettings.subscriptionsPage.pageElements &&
    settings.youtube.pageSettings.subscriptionsPage.pageElements.other &&
    Array.isArray(
      settings.youtube.pageSettings.subscriptionsPage.pageElements.other
    )
  ) {
    const otherElements =
      settings.youtube.pageSettings.subscriptionsPage.pageElements.other;
    const index = otherElements.indexOf("subscriptionShorts");
    if (index !== -1) {
      otherElements[index] = "subscriptionsShorts";
    }
  }
  return settings;
}

/**
 * Installation and Update Logic
 */
chrome.runtime.onInstalled.addListener(async (details) => {

  console.log('This is what is inside the storage.sync');
  const okay = await chrome.storage.sync.get(["appSettings"]);
  console.log(okay);


  if (details.reason === "install" || details.reason === "update") {
    try {
      const result = await chrome.storage.sync.get(["appSettings"]);
      let updatedSettings;

      if (result.appSettings) {
        console.log("Existing settings found. Updating...");
        updatedSettings = result.appSettings;
      } else {
        console.log("No existing settings found. Using initial settings...");
        updatedSettings = initialAppSettings;
      }

      // Apply fixes
      updatedSettings = await fixObjectSelectors(updatedSettings);
      updatedSettings = await fixSubscriptionsShorts(updatedSettings);

      await chrome.storage.sync.set({ appSettings: updatedSettings });
      console.log("App settings updated successfully:", updatedSettings);
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
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
      const lastSelectedPage = Object.keys(
        APP_MAPPINGS[hostname].pages
      ).includes(pathname)
        ? APP_MAPPINGS[hostname]?.pages[pathname]
        : // Set the page as not supported
          PAGE_NOT_SUPPORTED;

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
