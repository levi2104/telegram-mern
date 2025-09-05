<<<<<<< HEAD
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from 'react-router-dom'
import UserContext from "./context/UserContext";
import CaptainContext from "./context/CaptainContext";
import SocketProvider from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
  <>
    <CaptainContext>
      <UserContext>
        <SocketProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketProvider>
      </UserContext>
    </CaptainContext>
=======
import { Provider } from "./components/ui/provider";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./context/ChatProvider";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Provider>
        <ToastProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </ToastProvider>
      </Provider>
    </BrowserRouter>
>>>>>>> d3808cfd740e15b8894f577daed30ffa259a270c
  </>
);
