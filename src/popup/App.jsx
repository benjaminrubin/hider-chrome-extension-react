import React, { useEffect, useState } from "react";
import "./popup.css";
import Logo from "./Logo.jsx";
import { APP_NAMES } from "../GlobalUtils.js";
import Settings from "./components/Settings.jsx";
import Sidebar from "./Sidebar.jsx";


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
  const [extensionVersion, setExtensionVersion] = useState('');

  useEffect(() => {
    const manifest = chrome.runtime.getManifest();
    setExtensionVersion(manifest.version);
  }, []);


  const SelectedAppComponent = APPS[APP_NAMES.YOUTUBE].COMPONENT;

  return (
    <>
      <h4 id="version">Hider Version {extensionVersion}</h4>
      <Logo />
      <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
        {/* <Sidebar /> */}
        <Settings />
      </div>
    </>
  );
};

export default App;
