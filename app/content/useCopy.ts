import { useLocation } from "react-router";
import { COPY, langFromPath, type Copy, type Lang } from "./copy";
import { tabFromPath } from "./pages";

export function usePage(): { lang: Lang; copy: Copy; tab: ReturnType<typeof tabFromPath> } {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  return { lang, copy: COPY[lang], tab: tabFromPath(pathname) };
}
