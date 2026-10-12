
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { applySiteMetadata } from "./lib/seo";

import "./styles/index.css";

/* =========================================================
   WEBSITE METADATA
========================================================= */

applySiteMetadata();

/* =========================================================
   REACT ROOT
========================================================= */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
