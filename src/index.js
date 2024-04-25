import React from "react";
// import ReactDOM from "react-dom";
import { hydrate, render } from "react-dom";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(
    <HelmetProvider>
      <App />
    </HelmetProvider>,
    rootElement,
  );
} else {
  render(
    <HelmetProvider>
      <App />
    </HelmetProvider>,
    rootElement,
  );
}
