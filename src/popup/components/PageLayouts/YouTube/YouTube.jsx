import React, { useContext } from "react";
import {
  updateLastSelected,
  updateSelectedPage,
} from "../../../../state/actionCreators";
import HomePage from "./HomePage.jsx";
import VideoPage from "./VideoPage.jsx";
import SearchPage from "./SearchPage.jsx";
import PageSelectDropdown from "../../PageSelectDropdown.jsx";
import { AppStateContext } from "../../../../state/AppStateReducer.jsx";
import { APP_NAMES, YOUTUBE_PAGE_NAMES, updateChromeStorage } from "../../../../GlobalUtils.js";

export const YOUTUBE_PAGES = {
  [YOUTUBE_PAGE_NAMES.HOME_PAGE]: {
    LABEL: "Home Page",
    PATH: "",
    COMPONENT: HomePage,
  },
  [YOUTUBE_PAGE_NAMES.VIDEO_PAGE]: {
    LABEL: "Video Page",
    PATH: "/watch",
    COMPONENT: VideoPage,
  },
  [YOUTUBE_PAGE_NAMES.SEARCH_PAGE]: {
    LABEL: "Search Page",
    PATH: "/results",
    COMPONENT: SearchPage,
  },
};

const YouTube = () => {
  const { state, dispatch } = useContext(AppStateContext);
  const { lastSelectedPage: selectedPage } = state.lastSelectedState;

  const selectPage = async (page) => {
    dispatch(updateLastSelected(APP_NAMES.YOUTUBE, page));
    
    try {
      const chromeStorageState = await chrome.storage.local.get("appState");
      chromeStorageState.appState.lastSelectedState.lastSelectedPage = page;
      updateChromeStorage(chromeStorageState.appState);
    } catch (error) {
      console.error("Error handling update:", error);
    }
  };

  // Set the correct page component to render
  const SelectedPageComponent = YOUTUBE_PAGES[selectedPage].COMPONENT;

  return (
    <div>
      <h2 className='instructions'>Select the page</h2>
      <PageSelectDropdown
        selectedPage={state.lastSelectedState.lastSelectedPage}
        selectPage={selectPage}
      />
      <h2 className='instructions'>Click on an element to toggle it</h2>
      <SelectedPageComponent />
    </div>
  );
};

export default YouTube;
