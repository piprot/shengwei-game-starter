import "./styles.css";
import "./training.css";
import "./trial.css";
import "./account.css";
import "./duel.css";
import "./role.css";
import "./motion.css";
import "./unlocks.css";
import { AdaptiveGameApp } from "./ui/App";

const root = document.querySelector<HTMLElement>("#app");
if (root) {
  new AdaptiveGameApp(root);
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("./sw.js");
  });
}
