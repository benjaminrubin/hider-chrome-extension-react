import React, { useEffect, useState } from "react";
import "./popup.css";
import Settings from "./components/Settings.jsx";
import Navigation from "./Navigation.jsx";
import Menu from "./Menu.jsx";
import { useDarkMode } from "./DarkModeContext.js";

const App = () => {
  const { darkModeOn } = useDarkMode();
  const [displayMenu, setDisplayMenu] = useState(false);

  return (
    <div className={darkModeOn ? 'dark-mode' : ''}>
      <Menu setDisplayMenu={setDisplayMenu} displayMenu={displayMenu} />
      <div id='app-canvas'>
        <div id="overlay" className={displayMenu ? 'visible' : ''}></div>
        <div id="app-body" className={displayMenu ? 'scale-down' : ''}>
          <Navigation setDisplayMenu={setDisplayMenu} />
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <Settings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
