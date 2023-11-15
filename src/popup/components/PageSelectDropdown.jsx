import React, { useState } from "react";
import "./PageSelectDropdown.css";
import { YOUTUBE_PAGES } from "./PageLayouts/YouTube/YouTube.jsx";

const PageSelectDropdown = ({ selectPage, selectedPage }) => {

  return (
    <div className='page-buttons'>
      {Object.entries(YOUTUBE_PAGES).map(([key, { LABEL }]) => {
        const selectedClass =
          key === selectedPage ? "page-button-selected" : "";
        return (
          <div
            id={selectedClass}
            className='page-button'
            onClick={() => selectPage(key)}
            value={key}
            key={key}
          >
            {LABEL}
          </div>
        );
      })}
    </div>
  );
};

export default PageSelectDropdown;
