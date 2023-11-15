import React, { useContext, useEffect, useState } from "react";
import "./popup.css";
import Logo from "./Logo.jsx";
import { AppStateContext } from "../state/AppStateReducer.jsx";
import YouTube from "./components/PageLayouts/YouTube/YouTube.jsx"
import { APP_NAMES } from "../GlobalUtils.js";


export const APPS = {
  [APP_NAMES.YOUTUBE]: {
    LABEL: "YouTube",
    COMPONENT: YouTube,
  },
  [APP_NAMES.TIKTOK]: {
    LABEL: "TikTok",
    COMPONENT: null,
  },
};

const App = () => {
  const { state, dispatch } = useContext(AppStateContext);
  // Retrieve the last selected app
  const { lastSelectedApp: selectedApp } = state.lastSelectedState;
  const SelectedAppComponent = APPS[selectedApp].COMPONENT;

  if (!state) {
    return (
      <>
        <Logo />
        <h2 style={{ fontSize: '3rem'}}>Loading...</h2>
        </>
    )
  }

  return (
    <>
      <h4 id="version">Version: 1.0.0</h4>
      <Logo />
      <SelectedAppComponent />
    </>
  );
};

export default App;
