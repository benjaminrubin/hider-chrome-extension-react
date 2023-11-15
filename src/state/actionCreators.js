import { UPDATE_ELEMENT_STATE, UPDATE_SELECTED_STATE } from "./ActionTypes";


export const updateElementState = (app, element, updatedState) => {
  return {
    type: UPDATE_ELEMENT_STATE,
    payload: { app, element, updatedState },
  };
};

export const updateLastSelected = (selectedApp, selectedPage) => ({
  type: UPDATE_SELECTED_STATE,
  payload: { selectedApp, selectedPage },
});