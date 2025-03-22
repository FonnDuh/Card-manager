import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/IndexDarkmode.css";
import App from "./App.tsx";
import { DarkModeProvider } from "./context/DarkModeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <DarkModeProvider>
    <App />
  </DarkModeProvider>
);
