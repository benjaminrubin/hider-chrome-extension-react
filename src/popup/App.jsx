import React, { useEffect, useState } from "react";
import "./popup.css";
import Logo from "./Logo.jsx";
import Settings from "./components/Settings.jsx";

const App = () => {
  const [version, setVersion] = useState("");
  const [reviewBtnLabel, setReviewBtnLabel] = useState("Leave a Review ⭐️");

  useEffect(() => {
    const manifest = chrome.runtime.getManifest();
    setVersion(manifest.version);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "2px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Logo />
          <h4 id='version'>Version {version}</h4>
        </div>
        <a
          href='https://chromewebstore.google.com/detail/dnnpgmbhdojpjkpeeafgdelohfhbpiga?hl=en'
          style={{ textDecoration: "none" }}
          target='_blank'
        >
          <h4 id='leave-review' onClick={() => setReviewBtnLabel("Thank you!")}>
            {reviewBtnLabel}
          </h4>
        </a>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        {/* <Sidebar /> */}
        <Settings />
      </div>
    </>
  );
};

export default App;
