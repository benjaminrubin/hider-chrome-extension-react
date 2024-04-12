import React, { useEffect, useState } from "react";
import "./WindowFrame.css";
import "./Layouts.css";
import { WindowFrame } from "./WindowFrame.jsx";
import PageLayoutElement from "./PageLayoutElement.jsx";

const Page = ({ appName, clickedPage, pageElements, pageLayoutClassName }) => {
  const [appSettings, setAppSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch settings from chrome.storage.sync
    const fetchSettings = () => {
      chrome.storage.sync.get("appSettings", (result) => {
        if (result.appSettings) {
          setAppSettings(result.appSettings);
        }
        setIsLoading(false);
      });
    };

    fetchSettings();
  }, []);

  /**
   * Toggles element both in popup and current tab.
   * 
   * @param {string} element 
   * @param {boolean} isLocked 
   * @param {boolean} updatedVisibility 
   */
  const toggleElement = (element, isLocked, updatedVisibility) => {
    if (!isLocked) {
      const newAppSettings = { ...appSettings };
      newAppSettings[appName].elementsSettings[element].isShown =
        updatedVisibility;
      setAppSettings(newAppSettings);

      try {
        chrome.storage.sync.set({ appSettings: newAppSettings });
      } catch (error) {
        console.error("Error toggling element and saving state:", error);
      }
    }
  };


  /**
   * Toggles a UI's lock state (locked or unlocked)
   * 
   * @param {string} element 
   * @param {boolean} updatedLockState 
   */
  const toggleLock = (element, updatedLockState) => {
    const newAppSettings = { ...appSettings };
    newAppSettings[appName].elementsSettings[element].isLocked =
      updatedLockState;
    setAppSettings(newAppSettings);
    try {
      chrome.storage.sync.set({ appSettings: newAppSettings });
    } catch (error) {
      console.error("Error locking element and saving state:", error);
    }
  };
  
  /**
   * Toggles all elements in a given page.
   * If there is at least one unlocked element that is displayed,
   * this function will default to hiding all remaining elements.
   * Otherwise, it will show all elements.
   * 
   */
  const toggleAllElements = () => {
    const newAppSettings = { ...appSettings };

    // Combine both mainLayout and other arrays
    const allElementsToToggle = [
      ...pageElements.mainLayout,
      ...pageElements.other,
    ];

    // Check if there is at least one unlocked element that is displayed
    const anyUnlockedDisplayed = allElementsToToggle.some((elementId) => {
      const element = newAppSettings[appName].elementsSettings[elementId];
      return !element.isLocked && element.isShown;
    });

    // Determine the desired state: hide if any unlocked element is displayed, otherwise show
    const desiredState = !anyUnlockedDisplayed;

    // Toggle all elements to the desired state
    allElementsToToggle.forEach((elementId) => {
      if (!newAppSettings[appName].elementsSettings[elementId].isLocked) {
        newAppSettings[appName].elementsSettings[elementId].isShown =
          desiredState;
      }
    });

    setAppSettings(newAppSettings);

    try {
      chrome.storage.sync.set({ appSettings: newAppSettings });
    } catch (error) {
      console.error("Error toggling all elements and saving state:", error);
    }
  };

  const renderElements = (elementArray) => {
    return elementArray.map((elementId) => {
      const { label, isShown, isLocked } =
        appSettings[appName].elementsSettings[elementId] || {};

      const newVisibility = !isShown;
      const newLockState = !isLocked;

      return (
        <PageLayoutElement
          key={elementId}
          id={elementId}
          label={label}
          isLocked={isLocked}
          isShown={isShown}
          onElementToggle={() =>
            toggleElement(elementId, isLocked, newVisibility)
          }
          onLockToggle={() => toggleLock(elementId, newLockState)}
        />
      );
    });
  };

  if (isLoading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
        Loading...
      </div>
    );
  }

  const clickedPagePath = appSettings[appName].pageSettings[clickedPage].path;

  // Last Selected App remains YouTube for now
  // This url is what is displayed in the browser UI's address bar (i.e. "www.youtube.com/watch")
  const url = appSettings.generalSettings.lastSelectedApp
    ? `${appName}.com${clickedPagePath}`
    : "";

  return (
    <>
      <div
        id='toggle-all'
        className='layout-element'
        onClick={toggleAllElements}
      >
        Toggle All Elements
      </div>
      <WindowFrame url={url}>
        <div id='page-layout' className={pageLayoutClassName}>
          {renderElements(pageElements.mainLayout)}
        </div>
      </WindowFrame>
      <h2 className='instructions'>Other elements</h2>
      {renderElements(pageElements.other)}
    </>
  );
};

export default Page;
