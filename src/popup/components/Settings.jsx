import React, { useEffect, useState } from "react";
import Page from "./PageLayouts/Page.jsx";
import PageSelectDropdown from "./PageLayouts/PageSelectDropdown.jsx";
import { APPS, PAGE_NOT_SUPPORTED, PAGES } from "../../background.js";
import pageSettingsData from "./page-settings-data.js";

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

        // Set to homepage if lastSelectedPage is PAGE_NOT_SUPPORTED
        const defaultPage =
          appSettings.generalSettings.lastSelectedPage === PAGE_NOT_SUPPORTED
            ? PAGES[APPS.YOUTUBE].HOME_PAGE
            : appSettings.generalSettings.lastSelectedPage;
        setClickedPage(defaultPage);
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

  const lastSelectedPage = appSettings.generalSettings.lastSelectedPage;

  // Ensure clickedPage is set to the homepage if the lastSelectedPage is PAGE_NOT_SUPPORTED
  const activePage = clickedPage || PAGES[APPS.YOUTUBE].HOME_PAGE;

  const clickedPageSettings =
  pageSettingsData[activePage];

  const pagesArray = Object.entries(pageSettingsData).map(
    ([_, { pageId, label }]) => ({
      pageId: pageId,
      pageLabel: label, // Use the extracted label here
    })
  );

  return (
    <div style={{ width: "100%" }}>
      <PageSelectDropdown
        lastSelectedPage={lastSelectedPage}
        clickedPage={clickedPage}
        setClickedPage={setClickedPage}
        pagesArray={pagesArray}
      />
      <Page
        appName={APPS.YOUTUBE}
        clickedPage={clickedPage}
        pageElements={clickedPageSettings.pageElements}
        pageLayoutClassName={clickedPageSettings.pageLayoutClassName}
      />
    </div>
  );
};

export default Settings;
