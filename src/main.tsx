import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import { AlertProvider } from "./contexts/AlertContext";
import { LoadingProvider } from "./contexts/LoadingContext.tsx";
import { UpdatePrompt } from "./pwa/UpdatePrompt.tsx";

// การตรวจสอบเวอร์ชันและการจัดการ PWA Update จะถูกจัดการภายในส่วนประกอบ UpdatePrompt
// โดยจะตรวจสอบเวอร์ชันจาก localStorage เทียบกับ __APP_VERSION__

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
