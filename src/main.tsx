import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import { AlertProvider } from "./contexts/AlertContext";
import { LoadingProvider } from "./contexts/LoadingContext.tsx";
import { UpdatePrompt } from "./pwa/UpdatePrompt.tsx";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <LoadingProvider>
      <AlertProvider>
        <App />
        <UpdatePrompt />
      </AlertProvider>
    </LoadingProvider>
  </StrictMode>
);
