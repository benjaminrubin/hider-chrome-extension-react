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
    <div id='app-body' className={darkModeOn ? 'dark' : ''}>
      <Menu
        setDisplayMenu={setDisplayMenu}
        displayMenu={displayMenu}
      />
      <Navigation
        setDisplayMenu={setDisplayMenu}
      />
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        {/* <Sidebar /> */}
        <Settings />
      </div>
    </div>
  );
};

export default App;
