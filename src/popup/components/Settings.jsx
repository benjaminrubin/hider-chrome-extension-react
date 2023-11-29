import React, { useEffect, useState } from "react";
import Page from "./PageLayouts/Page.jsx";
import PageSelectDropdown from "./PageLayouts/PageSelectDropdown.jsx";

const Settings = () => {
  const [appSettings, setAppSettings] = useState({});
  const [clickedPage, setClickedPage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const result = await chrome.storage.sync.get("appSettings");
      if (result.appSettings) {
        const { appSettings } = result;
        setAppSettings(appSettings);
        setClickedPage(appSettings.generalSettings.lastSelectedPage);
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
        Loading...
      </div>
    );
  }

  const { isAppSupported } = appSettings.generalSettings;
  const { lastSelectedApp, lastSelectedPage } = appSettings.generalSettings;
  const clickedPageSettings =
    appSettings[lastSelectedApp].pageSettings[clickedPage];
  const isPageSupported = !!clickedPageSettings;

  if (!isAppSupported || !isPageSupported) {
    return (
      <div
        style={{
          color: "black",
          textAlign: "center",
          fontWeight: "bold",
          marginTop: "20px",
          marginBottom: "20px",
          width: '100%'
        }}
      >
        {isAppSupported ? "This page is not supported" : "App is not supported"}
      </div>
    );
  }

  const pageLabels = Object.entries(
    appSettings[lastSelectedApp].pageSettings
  ).map(([key, { label }]) => label);

  return (
    <div style={{ width: "100%" }}>
      <PageSelectDropdown
        lastSelectedPage={lastSelectedPage}
        clickedPage={clickedPage}
        setClickedPage={setClickedPage}
        pageLabels={pageLabels}
      />
      <Page
        appName={lastSelectedApp}
        clickedPage={clickedPage}
        pageElements={clickedPageSettings.pageElements}
        pageLayoutClassName={clickedPageSettings.pageLayoutClassName}
      />
    </div>
  );
};

export default Settings;
