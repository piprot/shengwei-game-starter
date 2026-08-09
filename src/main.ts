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
    const hadController = Boolean(navigator.serviceWorker.controller);
    let updateReloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // 仅当页面已被旧 SW 控制时自动刷新，避免首次访问多加载一次。
      if (!hadController || updateReloaded) return;
      updateReloaded = true;
      window.setTimeout(() => window.location.reload(), 250);
    });
    // 每次加载带独立版本号并绕过 HTTP 缓存，避免 GitHub Pages CDN
    // 把旧 sw.js 缓存给老访客，导致其长期停留在旧版“空壳”菜单。
    void navigator.serviceWorker
      .register(`./sw.js?v=${Date.now()}`, { updateViaCache: "none" })
      .catch(() => {
        // 隐私模式或静态部署下注册失败不阻塞游戏。
      });
  });
}
