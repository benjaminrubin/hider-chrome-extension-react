import React from "react";
import "./MockBrowser.css";
import { useDarkMode } from '../../DarkModeContext.js';

export const MockBrowser = ({ children, url }) => {

  const { darkModeOn } = useDarkMode();

  // This component is the mock browser window, which contains
  // the obvious layout elements of the current page

  return (
    <div id='mock-browser' className={darkModeOn ? 'dark' : ''}>
      <div id='toolbar-background' className={darkModeOn ? 'dark' : ''}>
        <div id='toolbar-dots'></div>
        <div id='toolbar-url'>
          <div id='url' className={darkModeOn ? 'dark' : ''}>{url}</div>
        </div>
      </div>
      {children}
    </div>
  );
};
