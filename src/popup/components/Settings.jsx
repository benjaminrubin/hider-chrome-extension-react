import React, { useEffect, useState } from "react";
import Page from "./PageLayouts/Page.jsx";
import PageSelectDropdown from "./PageLayouts/PageSelectDropdown.jsx";
import { APPS, PAGE_NOT_SUPPORTED, PAGES } from "../../background.js";
import { useDarkMode } from "../DarkModeContext.js";

/**
 * Converts a string from hyphenated or space-separated format to camelCase.
 * If the string is already in camelCase or if the input is empty,
 * it returns the string as is or an empty string, respectively.
 *
 * @param {*} str The string to convert.
 * @returns The camelCased string or an empty string if input is not provided.
 */
const camelize = (str) => {
  // First, check if the input is already in camelCase. If it is, return as is.
  // A simple regex to check for camelCase. This regex will match if there are no hyphens
  // and if there's at least one lowercase letter followed by an uppercase letter.
  if (!str) return "";

  if (/^[^-]+([a-z][A-Z]|[A-Z][a-z])/.test(str)) {
    return str;
  }

  // If the input is not in camelCase, convert hyphenated or space-separated strings to camelCase
  return str
    .split(/-|\s+/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
};

const Settings = () => {
  const [appSettings, setAppSettings] = useState({});
  const [clickedPage, setClickedPage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { darkModeOn } = useDarkMode();

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

  let { lastSelectedPage } = appSettings.generalSettings;

  const clickedPageSettings =
    appSettings[APPS.YOUTUBE]?.pageSettings[clickedPage];
  const isPageSupported = lastSelectedPage !== PAGE_NOT_SUPPORTED;

  if (!isPageSupported) {
    return (
      <div
        style={{
          color: `${darkModeOn ? 'white' : 'black'}`,
          textAlign: "center",
          fontWeight: "bold",
          marginTop: "20px",
          marginBottom: "20px",
          width: "100%",
        }}
      >
        This page is not supported
      </div>
    );
  }

  const pageLabels = Object.entries(appSettings[APPS.YOUTUBE].pageSettings).map(
    ([_, { label }]) => label
  );

  return (
    <div style={{ width: "100%" }}>
      <PageSelectDropdown
        lastSelectedPage={lastSelectedPage}
        clickedPage={clickedPage}
        setClickedPage={setClickedPage}
        pageLabels={pageLabels}
      />

      {isPageSupported ? (
        <Page
          appName={APPS.YOUTUBE}
          clickedPage={clickedPage}
          pageElements={clickedPageSettings.pageElements}
          pageLayoutClassName={clickedPageSettings.pageLayoutClassName}
        />
      ) : (
        <div>Page is Not Supported</div>
      )}
    </div>
  );
};

export default Settings;
