import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import BasicApp from "./BasicApp.jsx";
import "./styles.css";

const isBasicRoute = window.location.pathname.replace(/\/+$/, "").endsWith("/basic");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isBasicRoute ? <BasicApp /> : <App />}
  </React.StrictMode>
);
