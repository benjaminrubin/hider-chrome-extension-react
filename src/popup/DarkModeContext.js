import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for dark mode
const DarkModeContext = createContext();

// Custom hook to use the DarkModeContext
export const useDarkMode = () => {
  return useContext(DarkModeContext);
};

// Create a provider component
export const DarkModeProvider = ({ children }) => {
    const [darkModeOn, setDarkModeOn] = useState(false);
    const [appSettings, setAppSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
        const result = await chrome.storage.sync.get("appSettings");
      if (result.appSettings) {
        const { appSettings } = result;
        const { darkModeOn } = appSettings.generalSettings;
        setAppSettings(result.appSettings);
        setDarkModeOn(darkModeOn);
      }
    };

    fetchSettings();
  }, []);

  const toggleDarkModeOn = () => {
    const newAppSettings = { ...appSettings };
    newAppSettings.generalSettings.darkModeOn = !darkModeOn;
    setAppSettings(newAppSettings);
    setDarkModeOn(!darkModeOn);
    try {
      chrome.storage.sync.set({ appSettings: newAppSettings });
    } catch (error) {
      console.error("Error toggling Dark Mode and saving state:", error);
    }
  };

  return (
    <DarkModeContext.Provider value={{ darkModeOn, toggleDarkModeOn }}>
      {children}
    </DarkModeContext.Provider>
  );
};
