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

  const [version, setVersion] = useState('');

  useEffect(() => {
    const manifest = chrome.runtime.getManifest();
    setVersion(manifest.version);
}, []);

  return (
    <>
      <h4 id="version">Version {version}</h4>
      <Logo />
      <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
        {/* <Sidebar /> */}
        <Settings />
      </div>
    </>
  );
};

export default App;
