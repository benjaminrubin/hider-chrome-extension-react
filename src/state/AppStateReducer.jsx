import React, { useEffect, useReducer, useState } from "react";
import {
  APP_NAMES,
  ELEMENT_SELECTORS,
  ELEMENT_STATE,
  YOUTUBE_PAGE_NAMES,
} from "../GlobalUtils.js";
import {
  INITIALIZE_STATE,
  UPDATE_ELEMENT_STATE,
  UPDATE_SELECTED_STATE,
} from "./ActionTypes.js";

export const AppStateContext = React.createContext(null);

function initializeStateFromSelectors(selectors) {
  // All elements are displayed by default
  const initialState = {};

  Object.keys(selectors).forEach((key) => {
    initialState[key] = {
      state: ELEMENT_STATE.DISPLAYED,
    };
  });

  return initialState;
}

export const initialAppState = {
  version: 1,
  lastSelectedState: {
    lastSelectedApp: APP_NAMES.YOUTUBE,
    lastSelectedPage: YOUTUBE_PAGE_NAMES.HOME_PAGE,
  },
  youtube: initializeStateFromSelectors(ELEMENT_SELECTORS.youtube),
};

function appStateReducer(state, action) {
  switch (action.type) {
    case UPDATE_SELECTED_STATE:
      return {
        ...state,
        lastSelectedState: {
          lastSelectedApp: action.payload.selectedApp,
          lastSelectedPage: action.payload.selectedPage,
        },
      };
    case UPDATE_ELEMENT_STATE:
      const { app, element, updatedState } = action.payload;
      // Create a new state with updated values
      return {
        ...state,
        [app]: {
          ...state[app],
          [element]: {
            state: updatedState,
          },
        },
      };
    case INITIALIZE_STATE:
      return action.payload;
    default:
      return state;
  }
}

export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialAppState);

  useEffect(() => {
    const fetchAppStorage = async () => {
      const result = await chrome.storage.local.get("appState");
      if (result.appState) {
        // If there is a state in chrome.storage.local, initialize the app with it
        dispatch({ type: INITIALIZE_STATE, payload: result.appState });
      } else {
        // If no state in chrome.storage.local, set it with the initialAppState
        await chrome.storage.local.set({ appState: initialAppState });
        dispatch({ type: INITIALIZE_STATE, payload: initialAppState });
      }
    };

    fetchAppStorage();
  }, []);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};
