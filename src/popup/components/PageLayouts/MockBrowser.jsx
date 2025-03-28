import React from "react";
import "../../popup.css";

export const MockBrowser = ({ children, url }) => {


console.log('url is', url)

  // This component is the mock browser window, which contains
  // the obvious layout elements of the current page

  return (
    <div id='mock-browser'>
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
