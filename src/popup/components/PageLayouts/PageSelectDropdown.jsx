import React from "react";
import "./PageSelectDropdown.css";

const PageSelectDropdown = ({ selectedPage, pageLabels }) => {

  return (
    <div className='page-buttons'>
      {pageLabels.map((label) => {

        // Ex. of comparison pre formatting would be "Home Page" === "homePage"
        const selectedClass = label.replace(/ /g,"").toLowerCase() === selectedPage.toLowerCase() ? "page-button-selected" : "";
        
        return (
          <div
            id={selectedClass}
            className='page-button'
            // onClick={() => setSelectedPage(key)} TODO: Resolve this 
            value={label}
            key={label}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default PageSelectDropdown;
