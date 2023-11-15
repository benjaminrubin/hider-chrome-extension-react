import React, { useContext } from "react";
import "../Layouts.css";
import Page from "./Page.jsx";

const HomePage = () => {
  const homePageElements = {
    mainLayout: ["navigation", "sidebar", "videos"],
    other: ["homeShorts"],
  };
  return (
    <Page pageElements={homePageElements}
    pageLayoutClass='home-page'/>
  );
};

export default HomePage;