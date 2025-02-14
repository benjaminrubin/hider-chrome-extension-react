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
    label: "Subscriptions",
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
    path: "/@<channelName>",
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

export default pageSettingsData;
