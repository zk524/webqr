import { createRoot } from "react-dom/client";
import { register } from "./serviceWorkerRegistration";
import App from "./App";

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
register();
