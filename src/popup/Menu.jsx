import React, { useEffect, useState } from "react";
import Logo from "./Logo.jsx";
import { useDarkMode } from "./DarkModeContext.js";

const Menu = ({ setDisplayMenu, displayMenu }) => {
  const [version, setVersion] = useState("");
  const { darkModeOn, toggleDarkModeOn } = useDarkMode();

  useEffect(() => {
    const manifest = chrome.runtime.getManifest();
    setVersion(manifest.version);
  }, []);

  const toggleSettings = () => {
    toggleDarkModeOn();
  };

  const ToggleDarkModeButton = () => {
    return (
      <>
        <div id='dark-mode-button' onClick={toggleSettings}>
          <div>Dark Mode</div>
          <div style={{ color: `${darkModeOn ? "#85ECFF" : ""}` }}>
            {darkModeOn ? "On" : "Off"}
          </div>
        </div>
      </>
    );
  };

  const renderMenuClassNames = () => {
    let menuClassNames = "";
    if (displayMenu) {
      menuClassNames += "menu-displayed ";
    }

    if (darkModeOn) {
      menuClassNames += "dark ";
    }

    return menuClassNames;
  };

  return (
    <div id='menu' className={renderMenuClassNames()}>
      <div
        id='close-menu-button'
        onClick={() => setDisplayMenu(false)}
        className={darkModeOn ? "dark" : ""}
      >
        <div>&times;</div>
      </div>
      <div id='menu-body' className={darkModeOn ? "dark" : ""}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "2rem",
          }}
        >
          <Logo />
          <h4 id='version'>Version {version}</h4>
          <div id='last-updated'>Last updated on September 16th, 2024</div>
        </div>
        <ToggleDarkModeButton />
      </div>
      <footer>
      <div id="issues">Encountering any issues?</div> <div id="submit-ticket"> <a href="https://docs.google.com/forms/d/e/1FAIpQLSepM4FmUS9eseL1y756Xvz0bmKPxdlTzVpNgCpkmCDrDHoHLw/viewform" target="_blank">Submit a support ticket here</a></div>
        Developed by <a href='https://www.benjaminrubin.me' target="_blank">Benjamin Floyd Rubin</a>
      </footer>
    </div>
  );
};

export default Menu;
