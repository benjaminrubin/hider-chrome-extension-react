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
  const [version, setVersion] = useState("");
  const [reviewBtnLabel, setReviewBtnLabel] = useState("Leave a Review ⭐️");

  useEffect(() => {
    const manifest = chrome.runtime.getManifest();
    setVersion(manifest.version);

    // Send a message to the background.js to re-determine the
    // current tab
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h4 id='version'>Version {version}</h4>
        <a href='https://chromewebstore.google.com/detail/dnnpgmbhdojpjkpeeafgdelohfhbpiga?hl=en' style={{ textDecoration: 'none' }} target="_blank">
          <h4 id='leave-review' onClick={() => setReviewBtnLabel('Thank you!')}>{reviewBtnLabel}</h4>
        </a>
      </div>
      <Logo />
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        {/* <Sidebar /> */}
        <Settings />
      </div>
    </>
  );
};

export default App;
