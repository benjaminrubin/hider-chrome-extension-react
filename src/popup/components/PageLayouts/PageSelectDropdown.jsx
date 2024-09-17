import React from "react";
import "../../popup.css";

const PageSelectDropdown = ({
  lastSelectedPage,
  clickedPage,
  setClickedPage,
  pagesArray,
}) => {
  return (
    <>
      <div id='page-select-dropdown'>
        {pagesArray.map((page) => {
          const isCurrentPage =
            page.pageId.toLowerCase() === lastSelectedPage.toLowerCase();
          const clickedClassname =
            page.pageId.toLowerCase() === clickedPage.toLowerCase()
              ? "page-button-clicked"
              : "";

          return (
            <div className='page-button-container' key={page.pageId}>
              {isCurrentPage && <div id='current-page'>Current ↓</div>}
              <div
                id={page.pageId}
                className={`page-button ${clickedClassname}`}
                onClick={() => setClickedPage(page.pageId)} // Use pageId directly
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
