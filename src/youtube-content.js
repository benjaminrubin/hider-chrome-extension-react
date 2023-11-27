chrome.storage.onChanged.addListener(async () => {
  await applySettings();
});

const applySettings = async () => {
  chrome.storage.local.get("appSettings", ({ appSettings }) => {
    if (appSettings && appSettings.youtube) {
      const { elementsSettings, pageSettings } = appSettings.youtube;

      let css = '';

      // Determine the current page and get its relevant elements
      const currentPagePath = window.location.pathname;
      const currentPage = Object.values(pageSettings).find(page => page.path === currentPagePath) || {};

       // Combine both mainLayout and other arrays of page elements
      const relevantElements = [...(currentPage.pageElements?.mainLayout || []), ...(currentPage.pageElements?.other || [])];

      relevantElements.forEach((elementKey) => {
        if (elementsSettings[elementKey] && !elementsSettings[elementKey].isShown) {
          const selectors = elementsSettings[elementKey].selectors;
          if (selectors && selectors.length > 0) {
            selectors.forEach((selector) => {
              css += `${selector} { display: none !important; }\n`;
            });
          }
        }
      });

      // Remove existing and add new styles
      let existingStyle = document.getElementById('youtube-custom-style');
      if (existingStyle) {
        existingStyle.remove();
      }

      let style = document.createElement('style');
      style.setAttribute('id', 'youtube-custom-style');
      style.textContent = css;
      document.head.appendChild(style);
    }
  });
}

applySettings();