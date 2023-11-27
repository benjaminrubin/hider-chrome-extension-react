import React from "react";
import "./popup.css";
import Logo from "./Logo.jsx";
import { APP_NAMES } from "../GlobalUtils.js";
import Settings from "./components/Settings.jsx";


export const APPS = {
  [APP_NAMES.YOUTUBE]: {
    LABEL: "YouTube",
    COMPONENT: Settings,
  },
  [APP_NAMES.TIKTOK]: {
    LABEL: "TikTok",
    COMPONENT: null,
  },
};

const App = () => {

  const SelectedAppComponent = APPS[APP_NAMES.YOUTUBE].COMPONENT;

  return (
    <>
      <h4 id="version">Version: 1.0.0</h4>
      <Logo />
      <Settings />
    </>
  );
};

export default App;
