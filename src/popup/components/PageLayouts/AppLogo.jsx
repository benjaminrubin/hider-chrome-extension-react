import React from "react";
import "../AppLogos.css";
import youtubeLogo from '../../../../public/images/youtube-logo.png';
import linkedinLogo from '../../../../public/images/linkedin-logo.png';
import facebookLogo from '../../../../public/images/facebook-logo.png';
import twitterLogo from '../../../../public/images/twitter-logo.png';


/**
 * View the popup window by typing:
 * chrome-extension:<id of chrome extension>/popup.html
 */

const AppLogo = ({ appName }) => {

  const logos = {
    youtube: youtubeLogo,
    linkedin: linkedinLogo,
    facebook: facebookLogo,
    twitter: twitterLogo
  }

  const logoSrc = logos[appName];
    
  return <img id='app-logo' src={logoSrc} alt={`${appName} Logo`} />;
};

export default AppLogo;
