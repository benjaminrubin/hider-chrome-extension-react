import React from "react";
import "../Layouts.css";
import Page from "./Page.jsx";
import { YOUTUBE_PAGES } from "./YouTube.jsx";


const VideoPage = () => {
  
  const videoPageElements = {
    mainLayout: ['navigation', 'player', 'title-and-description', 'comments', 'recommendations'],
    other: ['live-chat']
  }

  return (
    <Page
      pageElements={videoPageElements}
      pageLayoutClass='video-page'
    />
  );
};

export default VideoPage;