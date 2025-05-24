import { useRef, useState } from "react";

export const useDebouncer = <Input, Output>({
  fn,
  delayMs,
  initialValue,
}: {
  fn: (props: Input) => Promise<Output>;
  delayMs: number;
  initialValue: Output;
}): {
  debouncedValue: Output;
  debounceFn: (props: Input) => void;
  isPending: boolean;
} => {
  const [debouncedValue, setDebouncedValue] = useState<Output>(initialValue);
  const [isPending, setIsPending] = useState(false);

  const timerRef = useRef<number>(null);
  const debounceFn = (props: Input) => {
    setIsPending(true);
    const t = timerRef?.current;
    if (t !== undefined && t !== null) {
      window.clearTimeout(t);
    }
    timerRef.current = window.setTimeout(async () => {
      const value = await fn(props);
      setIsPending(false);
      setDebouncedValue(value);
    }, delayMs);
  };

  return { debouncedValue, debounceFn, isPending };
};
