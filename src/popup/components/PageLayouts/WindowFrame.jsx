import React from 'react';
import "./WindowFrame.css";

export const WindowFrame = ({ children, url }) => {
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