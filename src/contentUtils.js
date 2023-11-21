export const PAGE_ELEMENT_SELECTORS = {
    youtube: {
      navigation: ["#masthead-container"],
      player: ["#player"],
      "title-and-description": ["#above-the-fold"],
      comments: ["#comments"],
      recommendations: ["#related", "#items"],
      "live-chat": ["#chat-container"],
      homeShorts: [],
      searchShorts: [],
      videos: ["#contents"],
      sidebar: ["#guide-content", "ytd-mini-guide-renderer"],
      results: ["#page-manager"],
    },
    tiktok: {
      url: "www.tiktok.com",
    },
};
  
export const TOGGLE_FUNCTION_TYPE = {
    STATIC: "static",
    DYNAMIC: "dynamic",
  };