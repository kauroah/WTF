import { useEffect } from "react";

export function usePageMeta(title, noindex = false) {
  useEffect(() => {
    document.title = title ? `${title} | WHAT THE FASHION` : "WHAT THE FASHION — люди для fashion-работы";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = noindex ? "noindex, nofollow" : "index, follow";
  }, [title, noindex]);
}