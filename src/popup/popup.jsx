import React from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { AppStateProvider } from "../state/AppStateReducer.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>
);
