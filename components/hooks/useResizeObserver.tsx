import { RefObject, useEffect } from "react";

export const useResizeObserver = <T extends Element>(
  ref: RefObject<T | null>,
  callback: (el: T) => void,
  deps: unknown[] = [],
) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new ResizeObserver(() => callback(el));
    obs.observe(el);

    callback(el);

    return () => obs.disconnect();
  }, deps);
};
