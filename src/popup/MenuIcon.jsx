import React from "react";
import { useDarkMode } from "./DarkModeContext";

const MenuIcon = ({ setDisplayMenu }) => {
  const { darkModeOn } = useDarkMode();

  return (
    <div
      id='menu-icon'
      className={darkModeOn ? 'dark' : ''}
      onClick={() => setDisplayMenu(true)}
    >
      <HamburgerIcon
        height={18}
        width={16}
        lineWidth={28}
        lineHeight={3}
        lineColor={darkModeOn ? '#fff' : '#212121'}
      />
    </div>
  );
};

export default MenuIcon;

const HamburgerIcon = ({
  width = 30,
  height = 24,
  lineColor = "#000",
  lineHeight = 3,
  lineWidth = 24,
}) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${lineWidth} ${height}`}
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect width={lineWidth} height={lineHeight} fill={lineColor} />
    <rect y='10' width={lineWidth} height={lineHeight} fill={lineColor} />
    <rect y='20' width={lineWidth} height={lineHeight} fill={lineColor} />
  </svg>
);
