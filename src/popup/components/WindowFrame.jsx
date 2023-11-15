import React, { useContext } from "react";
import "./WindowFrame.css";
import { AppStateContext } from "../../state/AppStateReducer.jsx";
import { YOUTUBE_PAGES } from "./PageLayouts/YouTube/YouTube.jsx";

const WindowFrame = ({ children }) => {
  const { state } = useContext(AppStateContext);
  const { lastSelectedApp: selectedApp, lastSelectedPage: selectedPage } = state.lastSelectedState;

  const url = `${selectedApp}.com${YOUTUBE_PAGES[selectedPage].PATH}`;

  return (
    <div id='window-frame-video'>
      <div id='toolbar-background'>
        <div id='toolbar-dots'></div>
        <div id='toolbar-url'>
          <div id='url'>{url}</div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default WindowFrame;
