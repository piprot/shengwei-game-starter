import "./styles.css";
import { AdaptiveGameApp } from "./ui/App";

const root = document.querySelector<HTMLElement>("#app");
if (root) {
  new AdaptiveGameApp(root);
}
