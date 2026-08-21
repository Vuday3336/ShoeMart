import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { store } from "./store/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2200,
            style: { fontSize: "14px", borderRadius: "8px" },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
