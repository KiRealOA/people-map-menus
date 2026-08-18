import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import BasicApp from "./BasicApp.jsx";
import AVSetup from "./AVSetup.jsx";
import "./styles.css";

const route = window.location.pathname.replace(/\/+$/, "");
const isBasicRoute = route.endsWith("/basic");
const isAVSetupRoute = route.endsWith("/av-setup");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAVSetupRoute ? <AVSetup /> : isBasicRoute ? <BasicApp /> : <App />}
  </React.StrictMode>
);
