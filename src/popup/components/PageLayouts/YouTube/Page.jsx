import React, { useContext } from "react";
import { AppStateContext } from "../../../../state/AppStateReducer.jsx";
import WindowFrame from "../../WindowFrame.jsx";
import { ELEMENT_SELECTORS, ELEMENT_STATE, ELEMENT_STATE_ACTION, updateChromeStorage } from "../../../../GlobalUtils.js";
import LayoutElement from "../LayoutElement/LayoutElement.jsx";
import { updateElementState } from "../../../../state/actionCreators.js";

const Page = ({ pageElements, pageLayoutClass }) => {
  const { state, dispatch } = useContext(AppStateContext);
  const { lastSelectedApp: app } = state.lastSelectedState;


  /**
   * Toggling an element will:
   * 1. Update the app's state/reducer
   * 2. Send a message to the service worker
   * 
   * @param {string} app 
   * @param {string} element 
   * @param {string} updatedVisibility 
   */
  const toggleElement = async (app, element, updatedVisibility) => {
    dispatch(updateElementState(app, element, updatedVisibility));

    const action = updatedVisibility !== ELEMENT_STATE.DISPLAYED
      ? ELEMENT_STATE_ACTION.HIDE
      : ELEMENT_STATE_ACTION.SHOW;

    try {
      const response = await chrome.runtime.sendMessage({
        action,
        element,
        app,
      });

      console.log('Response is', response);
    } catch (error) {
      console.error(error);
    }


    // try {
    //   const chromeStorageState = await chrome.storage.local.get("appState");
    //   chromeStorageState.appState[app][element].state = updatedVisibility;
    //   updateChromeStorage(chromeStorageState.appState);
    // } catch (error) {
    //   console.error("Error handling update:", error);
    // }
  };

  const renderElements = (elementArray) => {
    return elementArray.map((elementId) => {

      const { label } = ELEMENT_SELECTORS[app][elementId];
      const { state: elementDisplayState } = state[app][elementId];

      const newVisibility =
        elementDisplayState === ELEMENT_STATE.DISPLAYED
          ? ELEMENT_STATE.HIDDEN
          : ELEMENT_STATE.DISPLAYED;      
      
      return (
        <LayoutElement
          key={elementId}
          id={elementId}
          label={label}
          elementDisplayState={elementDisplayState}
          onClick={() => toggleElement(app, elementId, newVisibility)}
        />
      );
    });
  };

  return (
    <>
      <WindowFrame>
        <div id='page-layout' className={pageLayoutClass}>
          {renderElements(pageElements.mainLayout)}
        </div>
      </WindowFrame>
      <h2 className='instructions'>Other elements</h2>
      {renderElements(pageElements.other)}
    </>
  );
};

export default Page;
