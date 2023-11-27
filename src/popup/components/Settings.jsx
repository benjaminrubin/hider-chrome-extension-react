import React, { useEffect, useState } from "react";
import Page from "./PageLayouts/Page.jsx";


const Settings = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [currentPageSettings, setCurrentPageSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchSettings = async () => {
      const result = await chrome.storage.local.get("appSettings");
      if (result.appSettings) {
        const { lastSelectedApp, lastSelectedPage } = result.appSettings.generalSettings;
        setSelectedApp(lastSelectedApp);
        setCurrentPageSettings(result.appSettings[lastSelectedApp].pageSettings[lastSelectedPage]);
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const isPageSupported = !!currentPageSettings && !isLoading;

  if (isLoading) {
    return <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>Loading...</div>;
  }

  if (!isPageSupported) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        This page is not supported
      </div>
    );
  }

  return (
    <>
      <Page
        appName={selectedApp}
        pageElements={currentPageSettings.pageElements}
        pageLayoutClassName={currentPageSettings.pageLayoutClassName}
      />
    </>
  );
};

export default Settings;
