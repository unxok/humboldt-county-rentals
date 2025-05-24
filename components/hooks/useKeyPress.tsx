"use client";

import { useCallback, useEffect, useRef } from "react";

export const useDocumentEvent = <T extends keyof DocumentEventMap>(
  type: T,
  listener: (evt: DocumentEventMap[T]) => void | Promise<void>,
  deps: unknown[],
) => {
  const callback = useCallback(listener, deps);

  useEffect(() => {
    document.addEventListener(type, callback);

    return () => {
      document.removeEventListener(type, callback);
    };
  }, [deps]);
};
