import React from 'react';
import LockImage from '../../../../public/images/lock.png';
import { ELEMENT_STATE } from "../../../GlobalUtils.js";

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
          <img className='lock-image' src={LockImage} alt={'Lock'} />
        </div>
        {label}
      </div>
    );
};
  
export default PageLayoutElement;