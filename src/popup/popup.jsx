import React from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { DarkModeProvider } from "./DarkModeContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
);
