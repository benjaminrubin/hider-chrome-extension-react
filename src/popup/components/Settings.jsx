import React, { useEffect, useState } from "react";
import Page from "./PageLayouts/Page.jsx";
import PageSelectDropdown from "./PageLayouts/PageSelectDropdown.jsx";



const camelize = (str) => {
  // First, check if the input is already in camelCase. If it is, return as is.
  // A simple regex to check for camelCase. This regex will match if there are no hyphens
  // and if there's at least one lowercase letter followed by an uppercase letter.
  if (!str) return '';

  if (/^[^-]+([a-z][A-Z]|[A-Z][a-z])/.test(str)) {
    return str;
  }

  // If the input is not in camelCase, convert hyphenated or space-separated strings to camelCase
  return str
    // Split the string into words separated by hyphens or spaces.
    .split(/-|\s+/)
    // Transform each word: the first word is made lowercase; subsequent words are capitalized.
    .map((word, index) => 
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    // Join the transformed words back together.
    .join('');
};


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
        setClickedPage(camelize(appSettings.generalSettings.lastSelectedPage));
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

  // const { isAppSupported } = appSettings.generalSettings;
  const { lastSelectedApp, lastSelectedPage } = appSettings.generalSettings;
  const clickedPageSettings =
    appSettings[lastSelectedApp].pageSettings[clickedPage];
  const isPageSupported = !!clickedPageSettings;

  if (!isPageSupported) {
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
        This page is not supported
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
