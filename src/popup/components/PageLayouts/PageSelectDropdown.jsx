import React from "react";
import "./PageSelectDropdown.css";

const PageSelectDropdown = ({
  lastSelectedPage,
  clickedPage,
  setClickedPage,
  pageLabels,
}) => {
  // Camelize method
  const camelize = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  };

  /**
   * lastSelectedPage - the page determined by the window's URL
   * clickedPage - the page chosen by the user after clicking on the name
   * pageLabels - all the page names of the current app
   */

  return (
    <>
      <div className='page-buttons'>
        {pageLabels.map((pageLabel) => {
          // Ex. of comparison pre formatting would be "Home Page" === "homePage"
          const isCurrentPage =
            pageLabel.replace(/ /g, "").toLowerCase() ===
            lastSelectedPage.toLowerCase();
          const clickedId =
            pageLabel.replace(/ /g, "").toLowerCase() ===
            clickedPage.toLowerCase()
              ? "page-button-clicked"
              : "";

          return (
            <div className='page-button-container' key={pageLabel}>
              {isCurrentPage && <div id='current-page'>Current ↓</div>}
              <div
                id={clickedId}
                className='page-button'
                onClick={() => setClickedPage(camelize(pageLabel))}
                // value={pageLabel}
              >
                {pageLabel}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PageSelectDropdown;
