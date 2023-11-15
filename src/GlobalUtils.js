export const ELEMENT_STATE_ACTION = {
  SHOW: "show",
  HIDE: "hide",
};

export const ELEMENT_STATE = {
  DISPLAYED: "displayed",
  HIDDEN: "hidden",
};

export const APP_NAMES = {
  YOUTUBE: "youtube",
};

export const YOUTUBE_PAGE_NAMES = {
  HOME_PAGE: "home_page",
  VIDEO_PAGE: "video_page",
  SEARCH_PAGE: "search_page",
};

export const ELEMENT_SELECTORS = {
  youtube: {
    navigation: {
      label: "Navigation",
    },
    player: { label: "▶" },
    "title-and-description": {
      label: "Title and Description",
    },
    comments: { label: "Comments" },
    recommendations: {
      label: "Recs",
    },
    "live-chat": { label: "Live Chat" },
    videos: {
      label: "Videos",
    },
    homeShorts: {
      label: "Shorts",
    },
    searchShorts: {
      label: "Shorts"
    },
    sidebar: {
      label: "Sidebar",
    },
    results: {
      label: "Results",
    },
  },
  tiktok: {},
};

export const updateChromeStorage = async (newState) => {
  try {
    await chrome.storage.local.set({ appState: newState });
  } catch (error) {
    console.error("Error updating chrome storage:", error);
  }
};
