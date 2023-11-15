import { updateElementState } from "../../../state/actionCreators";


export const handleUpdate = async (dispatch, app, page, elementType, elementId, updatedVisibility) => {
    dispatch(updateElementState(app, page, elementType, elementId, updatedVisibility));

    try {
      const chromeStorageState = await chrome.storage.local.get("appState");
      chromeStorageState.appState[app][page][elementType][elementId].state = updatedVisibility;
      await updateChromeStorage(chromeStorageState.appState);
    } catch (error) {
      console.error("Error handling update:", error);
    }
};
  
const updateChromeStorage = async (newState) => {
    try {
      await chrome.storage.local.set({ appState: newState });
    } catch (error) {
      console.error("Error updating chrome storage:", error);
    }
};