import React from "react";
import { render, waitFor, screen, act } from "@testing-library/react";
import Settings from "../components/Settings";
import "@testing-library/jest-dom";
// import { appSettings } from "@settings"; // Using virtual module path

 const APPS = {
  YOUTUBE: "youtube",
};
 const PAGES = {
  [APPS.YOUTUBE]: {
    HOME_PAGE: "home-page",
    VIDEO_PAGE: "video-page",
    SEARCH_PAGE: "search-page",
  },
};
 const appSettings = {
  generalSettings: {
    isAppSupported: true, // <-- TODO: Remove this
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
          other: [
            "live-chat",
            "thumbnails",
            // "end-cards"
          ],
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
      // "end-cards": {
      //   label: "Video End Cards",
      //   isShown: true,
      //   isLocked: false,
      //   selectors: [".ytp-ce-element"],
      // },
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



jest.mock("../components/PageLayouts/Page", () => () => (
  <div>Page Component</div>
));
jest.mock("../components/PageLayouts/PageSelectDropdown", () => () => (
  <div>PageSelectDropdown Component</div>
));

const mockChromeStorageSync = {
  get: jest.fn((key, callback) => {
    if (key === "appSettings") {
      // Call the callback function with the object that contains your appSettings
      return { appSettings };
    } else {
      // You can handle other keys if necessary, or just return an empty object
      return {};
    }
  }),
  set: jest.fn(),
};

global.chrome = {
  storage: {
    sync: mockChromeStorageSync,
  },
  runtime: {},
};

describe("Settings component tests", () => {
  test("renders loading state initially", () => {
    render(<Settings />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("fetches settings and renders the data", async () => {
    render(<Settings />);
    await waitFor(() => screen.getByText("PageSelectDropdown Component"));
    expect(screen.getByText("Page Component")).toBeInTheDocument();
  });

  test("handles unsupported page settings", async () => {
    
    mockChromeStorageSync.get.mockImplementationOnce((keys, callback) => {
      const alteredSettings = {
        ...appSettings,
        generalSettings: {
          ...appSettings.generalSettings,
          lastSelectedApp: "Unsupported App",
          lastSelectedPage: "Not Relevant",
        },
      };
      return { appSettings: alteredSettings };
    });

    render(<Settings />);
    await waitFor(() => screen.getByText("This page is not supported"));
    expect(screen.getByText("This page is not supported")).toBeInTheDocument();
  });
});
