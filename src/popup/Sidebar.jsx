import React from "react";
import AppLogo from "./components/PageLayouts/AppLogo.jsx";

const Sidebar = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', paddingTop: '1rem', paddingRight: '.5rem', borderRight: '1px solid #E7E7E7', gap: '.75rem'}}>
      <AppLogo appName={"youtube"} />
      <AppLogo appName={"linkedin"} />
      <AppLogo appName={"twitter"} />
    </div>
  );
};

export default Sidebar;
