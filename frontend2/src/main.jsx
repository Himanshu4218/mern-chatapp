import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import axios from "axios";
import "./index.css";
import AlertProvider from "./Context/alertContext.jsx";
import ChatContextProvider from "./Context/chatContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
axios.defaults.baseURL = "http://localhost:5000";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChatContextProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </ChatContextProvider>
  </BrowserRouter>
);
