chrome.runtime.onMessage.addListener(async (message) => {
  if (message === "settingsUpdated") {
    await applySettings();
  }
});

/*
  This object MUST be identical to the object in page-settings-data.js in the popup
**/
const pageSettingsData = {
  ["home-page"]: {
    pageId: "home-page",
    label: "Home",
    path: "/",
    pageLayoutClassName: "home-page-layout",
    pageElements: {
      mainLayout: ["navigation", "sidebar", "videos"],
      other: ["homeShorts", "homeThumbnails", "youtubePlayables"],
    },
  },
  ["subscriptions-page"]: {
    pageId: "subscriptions-page",
    label: "Subs",
    path: "/feed/subscriptions",
    pageLayoutClassName: "subscriptions-page-layout",
    pageElements: {
      mainLayout: ["navigation", "sidebar", "videos"],
      other: ["subscriptionsShorts", "subscriptionsThumbnails"],
    },
  },
  ["search-page"]: {
    pageId: "search-page",
    label: "Search",
    path: "/results",
    pageLayoutClassName: "search-page-layout",
    pageElements: {
      mainLayout: ["navigation", "sidebar", "results"],
      other: ["searchShorts", "searchThumbnails", "irrelevantResults"],
    },
  },
  ["video-page"]: {
    pageId: "video-page",
    label: "Video",
    path: "/watch",
    pageLayoutClassName: "video-page-layout",
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
  ["channel-page"]: {
    pageId: "channel-page",
    label: "Channel",
    path: "/@Channel",
    pageLayoutClassName: "channel-page-layout",
    pageElements: {
      mainLayout: ["navigation", "sidebar", "channel"],
      other: ["channelThumbnails"],
    },
  },
  ['playlist-page']: {
    pageId: 'playlist-page',
    label: "Playlist",
    path: "/playlist",
    pageLayoutClassName: "playlist-page-layout",
    pageElements: {
      mainLayout: ["navigation", "sidebar", "playlist"],
      other: ["playlistThumbnails"]
    }
  },
  ['playlists-page']: {
    pageId: 'playlists-page',
    label: "All Playlists",
    path: "/feed/playlists",
    pageLayoutClassName: "playlists-page-layout",
    pageElements: {
      mainLayout: ["navigation", "sidebar", "playlists"],
      other: ["playlistsThumbnails"]
    }
  },
};

/**
 * All relevant selectors for each element
 */
const allSelectors = {
  navigation: {
    selectors: ["#masthead-container"],
  },
  player: {
    selectors: ["#player"],
  },
  "title-and-description": {
    selectors: ["#above-the-fold"],
  },
  comments: {
    selectors: ["ytd-comments", "ytm-comment-section-renderer"],
  },
  channel: {
    selectors: ["ytd-page-manager"],
  },
  recommendations: {
    selectors: ["#related"],
  },
  "live-chat": {
    selectors: ["#chat-container"],
  },
  playlists: {
    selectors: ["#contents"]
  },
  playlist: {
    selectors: ["ytd-browse"]
  },
  videos: {
    selectors: ["#contents", "#header"],
  },
  videoShorts: {
    selectors: [
      '[aria-label="Shorts"]',
      '[title="Shorts"]',
      "[is-shorts]",
      "ytd-reel-shelf-renderer",
    ],
  },
  homeShorts: {
    selectors: ['[aria-label="Shorts"]', '[title="Shorts"]', "[is-shorts]"],
  },
  "end-cards": {
    selectors: [".ytp-ce-element"],
  },
  irrelevantResults: {
    selectors: [
      "ytd-shelf-renderer[modern-typography]",
      "ytd-horizontal-card-list-renderer",
    ],
  },
  searchShorts: {
    selectors: [
      '[aria-label="Shorts"]',
      '[title="Shorts"]',
      "[is-shorts]",
      "ytd-reel-shelf-renderer",
      "a[href^='/shorts/']",
      "ytd-video-renderer:has(a[href^='/shorts/'])",
      "ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style='SHORTS'])"
    ],
  },
  subscriptionsShorts: {
    selectors: [
      '[aria-label="Shorts"]',
      '[title="Shorts"]',
      "[is-shorts]",
      "ytd-reel-shelf-renderer",
    ],
  },
  sidebar: {
    selectors: ["#guide-content", "ytd-mini-guide-renderer"],
  },
  results: {
    selectors: ["#page-manager"],
  },
  youtubePlayables: {
    selectors: ["ytd-rich-section-renderer"],
  },
  homeThumbnails: {
    selectors: [
      "ytd-thumbnail",
      "ytd-playlist-thumbnail",
      "#thumbnail",
      "#thumbnail-container",
      ".shelf-skeleton",
      ".thumbnail",
      ".ytp-videowall-still-image",
      ".shortsLockupViewModelHostThumbnailContainer",
    ],
    additionalCss: `
    .metadata.ytd-compact-video-renderer {
      padding-right: 0 !important;
    }
    .shelf-skeleton .video-skeleton {
      margin-right: 4px;
    }`,
  },
  channelThumbnails: {
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
      "yt-decorated-avatar-view-model",
    ],
    additionalCss: `
    .metadata.ytd-compact-video-renderer {
      padding-right: 0 !important;
    }
    .shelf-skeleton .video-skeleton {
      margin-right: 4px;
    }`,
  },
  playlistsThumbnails: {
    selectors: [
      ".yt-collection-thumbnail-view-model",
    ],
  },
  playlistThumbnails: {
    selectors: [
      "#thumbnail",
      ".page-header-view-model-wiz__page-header-headline-image-hero-container"
    ],
  },
  searchThumbnails: {
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
};

const applySettings = async () => {
  chrome.storage.sync.get("appSettings", ({ appSettings }) => {
    if (appSettings && appSettings.youtube) {
      const { elementsSettings } = appSettings.youtube;

      let css = "";

      console.log('the elementsSettings are', elementsSettings)

      // Determine the current page and get its relevant elements
      const currentPagePath = window.location.pathname;

      console.log('currentPagePath:', currentPagePath);
      console.log('pageSettingsData:', pageSettingsData)

      const currentPage =
        Object.values(pageSettingsData).find(
          (page) =>
            page.path === currentPagePath ||
            (page.path.startsWith("/@") && currentPagePath.startsWith("/@"))
        ) || {};

      console.log("currentPage is", currentPage)
      
      // Combine both mainLayout and other arrays of page elements
      const relevantElements = [
        ...(currentPage.pageElements?.mainLayout || []),
        ...(currentPage.pageElements?.other || []),
      ];


      console.log('relevantElements are', relevantElements);

      relevantElements.forEach((elementKey) => {
        if (
          elementsSettings[elementKey] &&
          !elementsSettings[elementKey].isShown
        ) {
          const selectors = allSelectors[elementKey].selectors;
          if (selectors && selectors.length > 0) {
            selectors.forEach((selector) => {
              css += `${selector} { display: none !important; }\n`;
            });
          }
          if (allSelectors[elementKey].additionalCss) {
            css += allSelectors[elementKey].additionalCss;
          }
        }
      });

      // Remove existing and add new styles
      let existingStyle = document.getElementById("youtube-custom-style");
      if (existingStyle) {
        existingStyle.remove();
      }

      console.log("Css is", css);

      let style = document.createElement("style");
      style.setAttribute("id", "youtube-custom-style");
      style.textContent = css;
      document.head.appendChild(style);
    }
  });
};

applySettings();
