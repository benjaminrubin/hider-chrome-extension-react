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

    return menuClassNames;
  };

  const DonateButton = () => {
    return (
      <a
        href='https://buymeacoffee.com/benjaminfloydrubin'
        target='_blank'
        id='donate-button'
      >
        <div>Buy me a coffee! ☕️</div>
      </a>
    );
  };

  const CloseMenuButton = () => {
    return (
      <div id='close-menu-button' onClick={() => setDisplayMenu(false)}>
        <div>&times;</div>
      </div>
    );
  };

  const MenuHeader = () => {
    return (
      <div id='menu-header'>
        <Logo />
        <h4 id='version'>Version {version}</h4>
        <div id='last-updated'>Last updated on September 17th, 2024</div>
        {/* <hr id="menu-header-divider" /> */}
      </div>
    );
  };

  const MenuSettings = () => {
    return (
      <div id='menu-settings'>
        <h3>Extension Settings</h3>
        <ToggleDarkModeButton />
      </div>
    );
  };

  const Support = () => {
    return (
      <div id='support'>
        <h3>Support</h3>
        <div id='issues'>Encountering any issues?</div>{" "}
        <div id='submit-ticket'>
          {" "}
          <a
            href='https://docs.google.com/forms/d/e/1FAIpQLSepM4FmUS9eseL1y756Xvz0bmKPxdlTzVpNgCpkmCDrDHoHLw/viewform'
            target='_blank'
          >
            Submit a support ticket here
          </a>
        </div>
        <div>
          Developed by{" "}
          <a href='https://www.benjaminrubin.me' target='_blank'>
            Benjamin Floyd Rubin
          </a>
        </div>
        <DonateButton />
      </div>
    );
  };

  return (
    <div id='menu' className={renderMenuClassNames()}>
      <CloseMenuButton />
      <div id='menu-body'>
        <MenuHeader />
        <div id='menu-settings-body'>
          <MenuSettings />
          <Support />
        </div>
      </div>
    </div>
  );
};

export default Menu;
