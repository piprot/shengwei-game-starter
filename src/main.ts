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
    // 固定 sw.js 地址并绕过浏览器 HTTP 缓存：只有内容真的变化时才会更新，
    // 避免每次加载带新时间戳导致 controllerchange -> reload 无限循环。
    void navigator.serviceWorker
      .register("./sw.js", { updateViaCache: "none" })
      .catch(() => {
        // 隐私模式或静态部署下注册失败不阻塞游戏。
      });
  });
}
