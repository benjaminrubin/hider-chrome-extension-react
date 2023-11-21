import { PAGE_ELEMENT_SELECTORS, TOGGLE_FUNCTION_TYPE } from "./contentUtils";

  /**
   * Receiving messages with toggle actions from the service worker (background.js)
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { app, element, action, toggleFunctionType } = message;

    console.log('This was the message received:', message)

    // Execute the appropriate toggle function
    switch (toggleFunctionType) {
      case TOGGLE_FUNCTION_TYPE.DYNAMIC:
        dynamicToggleLayoutElement(app, element, action);
        // break;
      default:
        staticToggleLayoutElement(app, element, action);
    }
  });

  /**
   * Toggles the display of static elements on a page (i.e. a navigation bar)
   * 
   * @param {string} app 
   * @param {string} element 
   * @param {string} action 
   */
  function staticToggleLayoutElement(app, element, action) {
    const relevantSelectors = PAGE_ELEMENT_SELECTORS[app][element];

    if (relevantSelectors && relevantSelectors.length > 0) {
      for (const selector of relevantSelectors) {
        
        console.log('We are toggling the following element -->', element);
        console.log('But was the object set yet?', PAGE_ELEMENT_SELECTORS)
        const selectedElement = document.querySelector(selector);
        console.log('Were we able to select it? -->', selectedElement);
        const currentDisplayValue = window.getComputedStyle(selectedElement).display;

        switch (action) {
          case "show":
            if (currentDisplayValue === "none") {
              selectedElement.style.display = "";
            }
            break;
          case "hide":
            if (currentDisplayValue !== "none") {
              selectedElement.style.display = "none";
            }
            break;
          default:
            "";
        }
      }
    }
  }

  /**
   * Toggles the display of dynamic elements on a page (i.e. sections
   * that dynamically appear as the user scrolls down the page such as the
   * YouTube Shorts section on a search results page.
   * @param {string} app 
   * @param {string} element 
   * @param {string} action 
   */

  function dynamicToggleLayoutElement(
    app,
    element,
    action,
  ) {

    const targetInnerText = {
      homeShorts: { innerText: "shorts", selector: "#dismissible" },
      searchShorts: { innerText: "shorts", selector: "ytd-reel-shelf-renderer" },
      peopleAlsoWatched: { innerText: "people also watched", selector: "" },
    };

    // Function to compare innerText, case-insensitive
    const matchesInnerText = (el, text) => {
      return el.innerText.toLowerCase().includes(text.toLowerCase());
    };

    // Function to apply styles to an element based on action
    const applyStyleToElement = (el) => {
      if (matchesInnerText(el, targetInnerText[element].innerText)) {
        el.style.display = action === "hide" ? "none" : "";
      }
    };

    // Find and apply styles to existing dismissible elements
    const existingDismissibles = document.querySelectorAll(
      targetInnerText[element].selector
    );
    existingDismissibles.forEach(applyStyleToElement);

    // Mutation Observer callback
    const mutationObserverCallback = (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.id === "dismissible") {
            applyStyleToElement(node);
          }
        });
      });
    };

    // Create a Mutation Observer to observe for dynamically added dismissible elements
    const mutationObserver = new MutationObserver(mutationObserverCallback);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }