import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CurrentUserProvider>
      <App />
    </CurrentUserProvider>
  </React.StrictMode>
);
