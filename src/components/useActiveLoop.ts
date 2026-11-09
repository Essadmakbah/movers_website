import { useEffect, useState, type RefObject } from "react";
import { useInView } from "motion/react";

/** True while the element is in view and the tab is visible. Loops pause otherwise. */
export function useActiveLoop(ref: RefObject<Element | null>, amount = 0.4): boolean {
  const inView = useInView(ref, { amount });
  const [visible, setVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return inView && visible;
}

/** Matches a media query, updating on change. */
export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatch(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return match;
}
