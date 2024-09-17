chrome.runtime.onMessage.addListener(async (message) => {
  if (message === "settingsUpdated") {
    await applySettings();
  }
});

/*
  This object MUST be identical to the object in page-settings-data.js in the popup
**/
const pageSettingsData = {
  ['home-page']: {
    pageId: 'home-page',
    label: "Home",
    path: "/",
    pageLayoutClassName: "home-page-layout",
    pageElements: {
      mainLayout: ["navigation", "sidebar", "videos"],
      other: ["homeShorts", "homeThumbnails", "youtubePlayables"],
    },
  },
  ['subscriptions-page']: {
    pageId: 'subscriptions-page',
    label: "Subs",
    path: "/feed/subscriptions",
    pageLayoutClassName: "subscriptions-page-layout",
    pageElements: {
      mainLayout: ["navigation", "sidebar", "videos"],
      other: ["subscriptionsShorts", "subscriptionsThumbnails"],
    },
  },
  ['search-page']: {
    pageId: 'search-page',
    label: "Search",
    path: "/results",
    pageLayoutClassName: "search-page-layout",
    pageElements: {
      mainLayout: ["navigation", "sidebar", "results"],
      other: ["searchShorts", "searchThumbnails", "irrelevantResults"],
    },
  },
  ['video-page']: {
    pageId: 'video-page',
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
  ['channel-page']: {
    pageId: 'channel-page',
    label: "Channel",
    path: "/@Channel",
    pageLayoutClassName: "channel-page-layout",
    pageElements: {
      mainLayout: ["navigation", "sidebar", "channel"],
      other: ["channelThumbnails"],
    },
  },
};

const applySettings = async () => {
  chrome.storage.sync.get("appSettings", ({ appSettings }) => {
    if (appSettings && appSettings.youtube) {
      const { elementsSettings } = appSettings.youtube;

      let css = "";

      // Determine the current page and get its relevant elements
      const currentPagePath = window.location.pathname;

      console.log('currentPagePath', currentPagePath)

      const currentPage =
        Object.values(pageSettingsData).find(
          (page) => page.path === currentPagePath || 
            (page.path.startsWith('/@') && currentPagePath.startsWith('/@'))
        ) || {};
      
      console.log('currentPage content.js is', currentPage)

      // Combine both mainLayout and other arrays of page elements
      const relevantElements = [
        ...(currentPage.pageElements?.mainLayout || []),
        ...(currentPage.pageElements?.other || []),
      ];

      relevantElements.forEach((elementKey) => {
        if (
          elementsSettings[elementKey] &&
          !elementsSettings[elementKey].isShown
        ) {
          const selectors = elementsSettings[elementKey].selectors;
          if (selectors && selectors.length > 0) {
            selectors.forEach((selector) => {
              css += `${selector} { display: none !important; }\n`;
            });
          }
          if (elementsSettings[elementKey].additionalCss) {
            css += elementsSettings[elementKey].additionalCss;
          }
        }
      });

      // Remove existing and add new styles
      let existingStyle = document.getElementById("youtube-custom-style");
      if (existingStyle) {
        existingStyle.remove();
      }

      console.log('Css is', css)

      let style = document.createElement("style");
      style.setAttribute("id", "youtube-custom-style");
      style.textContent = css;
      document.head.appendChild(style);
    }
  });
};

applySettings();
