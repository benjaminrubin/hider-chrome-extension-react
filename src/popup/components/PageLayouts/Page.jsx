import React, { useEffect, useState } from "react";
import "./WindowFrame.css";
import "./Layouts.css";
import PageSelectDropdown from "./PageSelectDropdown.jsx";
import { WindowFrame } from "./WindowFrame.jsx";
import PageLayoutElement from "./PageLayoutElement.jsx";
import AppLogo from "./AppLogo.jsx";


const Page = ({ appName, pageElements, pageLayoutClassName }) => {

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

    // Listener for changes in chrome.storage
    // chrome.storage.onChanged.addListener((changes, namespace) => {
    //   if ("appSettings" in changes) {
    //     fetchSettings();
    //   }
    // });

    return () => {
      // chrome.storage.onChanged.removeListener(fetchSettings);
    };
  }, []);

  const toggleElement = (element, isLocked, updatedVisibility) => {
    if (!isLocked) {
      const newAppSettings = { ...appSettings };
      newAppSettings[appName].elementsSettings[element].isShown =
        updatedVisibility;
      setAppSettings(newAppSettings);

      try {
        // Update chrome.storage
        chrome.storage.sync.set({ appSettings: newAppSettings });
      } catch (error) {
        console.error("Error toggling element and saving state:", error)
      }
    }
  };

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

  const toggleAllElements = () => {
    const newAppSettings = { ...appSettings };

    // Combine both mainLayout and other arrays
    const allElementsToToggle = [...pageElements.mainLayout, ...pageElements.other];
  
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
        newAppSettings[appName].elementsSettings[elementId].isShown = desiredState;
      }
    });
  
    setAppSettings(newAppSettings);
    try {
      chrome.storage.sync.set({ appSettings: newAppSettings });
    } catch (error) {
      console.error("Error toggling all elements and saving state:", error);
    }
  }

  const selectPage = async (page) => {
    try {
      const chromeStorageState = await chrome.storage.sync.get("appSettings");
      chromeStorageState.appSettings.generalSettings.lastSelectedPage = page;
      chrome.storage.sync.set({ appSettings: chromeStorageState.appSettings})
    } catch (error) {
      console.error("Error handling update:", error);
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
    return <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>Loading...</div>;
  }

  const { lastSelectedPage } = appSettings.generalSettings;
  const selectedPagePath = appSettings[appName].pageSettings[lastSelectedPage].path;
  const pageLabels = Object.entries(appSettings[appName].pageSettings).map(([key, { label }]) => label);

  const url = appSettings.generalSettings.lastSelectedApp
    ? `${appName}.com${selectedPagePath}`
    : "";
  
  return (
    <>
      <AppLogo
        appName={appName}
      />
      {/* <PageSelectDropdown
        selectedPage={lastSelectedPage}
        selectPage={selectPage}
        pageLabels={pageLabels}
      /> */}
      <div
        id="toggle-all"
        className='layout-element'
        onClick={toggleAllElements}
      >
        Toggle All Elements
      </div>
      <h2 className='instructions'>Click on an element to toggle it</h2>
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
