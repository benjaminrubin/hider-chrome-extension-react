import React, { useEffect, useState } from "react";
import MenuIcon from "./MenuIcon.jsx";

const Navigation = ({ setDisplayMenu }) => {
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "2px",
      }}
    >
      <MenuIcon
        setDisplayMenu={setDisplayMenu}
      />
      <a
        href='https://chromewebstore.google.com/detail/hide-thumbnails-shorts-an/dnnpgmbhdojpjkpeeafgdelohfhbpiga/reviews'
        style={{ textDecoration: "none" }}
        target='_blank'
      >
        <h4 id='leave-review'>Leave a Review ⭐️</h4>
      </a>
    </div>
  );
};

export default Navigation;
