import { StrictMode } from "react";
import "@fontsource-variable/noto-sans-jp";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { ModalProvider } from "./providers/ModalProvider.tsx";
import { ToastProvider } from "./providers/ToastProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ModalProvider>
    </QueryClientProvider>
  </StrictMode>,
);
