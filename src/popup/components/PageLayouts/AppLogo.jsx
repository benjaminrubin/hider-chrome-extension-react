import React from "react";
import "../AppLogos.css";
import youtubeLogo from '../../../../public/images/youtube-logo.png';

const AppLogo = ({ appName }) => {

  const logos = {
    youtube: youtubeLogo
  }

  const logoSrc = logos[appName];
    
  return <img id='app-logo' src={logoSrc} alt={`${appName} Logo`} />;
};

export default AppLogo;
