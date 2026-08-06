import "./styles.css";
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
