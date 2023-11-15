import React, { useContext } from "react";
import "../Layouts.css";

import Page from "./Page.jsx";


const SearchPage = () => {
  const searchPageElements = {
    mainLayout: ['navigation', 'sidebar', 'results'],
    other: ['searchShorts']
  }
  return (
    <Page pageElements={searchPageElements} pageLayoutClass='search-page' />
  );
};

export default SearchPage;
