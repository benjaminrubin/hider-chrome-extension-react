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
    lastSelectedApp: APPS.YOUTUBE,
    lastSelectedPage: PAGES[APPS.YOUTUBE].HOME_PAGE,
  },
  youtube: {
    pageSettings: {
      homePage: {
        label: "Home Page",
        path: "",
        pageLayoutClassName: "home-page",
        pageElements: {
          mainLayout: ["navigation", "sidebar", "videos"],
          other: ["homeShorts"],
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
          other: ["live-chat"],
        },
      },
      searchPage: {
        label: "Search Page",
        path: "/results",
        pageLayoutClassName: "search-page",
        pageElements: {
          mainLayout: ["navigation", "sidebar", "results"],
          other: ["searchShorts"],
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
        selectors: ["#comments"],
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
        selectors: [],
      },
      searchShorts: {
        label: "Shorts",
        isShown: true,
        isLocked: false,
        selectors: [],
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
