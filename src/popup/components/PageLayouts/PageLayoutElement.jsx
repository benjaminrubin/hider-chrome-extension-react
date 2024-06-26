import React from "react";
import LockEnabledImage from "../../../../public/images/lock-enabled.png";
import LockDisabledImage from "../../../../public/images/lock-disabled.png";


const ELEMENT_STATE = {
  DISPLAYED: "displayed",
  HIDDEN: "hidden",
};

const PageLayoutElement = ({
  id,
  label,
  isShown,
  isLocked,
  onElementToggle,
  onLockToggle,
}) => {
  const lockButtonClass = isLocked ? "locked" : "unlocked";

  const elementDisplayState = isShown
    ? ELEMENT_STATE.DISPLAYED
    : ELEMENT_STATE.HIDDEN;

  /**
   * This method handles the halting of event propagation
   * from the child element (lock UI) to the parent element (pageElement UI)
   * 
   * This is a workaround solution to updating the architecture and classes for the popup
   */
  const handleLockButtonClick = (e) => {
    e.stopPropagation();
    onLockToggle();
  };

  return (
    <div
      id={id}
      className={`${elementDisplayState} layout-element`}
      onClick={onElementToggle}
    >
      <div
        className={`lock-button ${lockButtonClass}`}
        onClick={handleLockButtonClick}
      >
        <img className='lock-image' src={isLocked ? LockEnabledImage : LockDisabledImage} alt={"Lock"} />
      </div>
      {label}
    </div>
  );
};

export default PageLayoutElement;
