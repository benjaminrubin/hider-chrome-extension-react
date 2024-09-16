import React from "react";
import "./PageSelectDropdown.css";
import { useDarkMode } from "../../DarkModeContext";

const PageSelectDropdown = ({
  lastSelectedPage,
  clickedPage,
  setClickedPage,
  pagesArray,
}) => {
  const { darkModeOn } = useDarkMode();

  /**
   * lastSelectedPage - the page determined by the window's URL
   * clickedPage - the page chosen by the user after clicking on the name
   * pagesArray - an array of objects containing "pageId" and "pageLabel" keys
   */

  // Camelize method
  const camelize = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  };

  return (
    <>
      <div className="page-buttons">
        {pagesArray.map((page) => {

          const isCurrentPage = page.pageId.toLowerCase() === lastSelectedPage.toLowerCase();
          const clickedId = page.pageId.toLowerCase() === clickedPage.toLowerCase()
            ? "page-button-clicked"
            : "";

          return (
            <div className="page-button-container" key={page.pageId}>
              {isCurrentPage && <div id="current-page">Current ↓</div>}
              <div
                id={clickedId}
                className={`page-button ${darkModeOn ? "dark" : ""}`}
                onClick={() => setClickedPage(camelize(page.pageId))} // Use pageId directly
                // No need for value prop, pageLabel is rendered
              >
                {page.pageLabel}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PageSelectDropdown;