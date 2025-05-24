import { tryCatch } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

export const useQuery = <T,>({
  queryFn,
  deps = [],
  onError,
  onSuccess,
}: {
  queryFn: (abortSignal: AbortSignal) => T | Promise<T>;
  deps?: unknown[];
  onError?: (e: unknown) => void | Promise<void>;
  onSuccess?: () => void | Promise<void>;
}) => {
  const controllerRef = useRef<AbortController>(null);
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>();

  const getData = async (abortSignal: AbortSignal) => {
    setIsPending(true);
    const result = await tryCatch(async () => {
      return await queryFn(abortSignal);
    });
    setIsPending(false);
    if (!result.success) {
      setError(result.error);
      setData(undefined);
      if (onError) {
        await onError(result.error);
      }
      return;
    }
    setData(() => result.data);

    if (onSuccess) {
      await onSuccess();
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    getData(controller.signal);
    return () => {
      controller.abort();
      controllerRef.current = null;
    };
  }, deps);

  return {
    data,
    error,
    isPending,
    isError: error !== null && error !== undefined,
    refetch: () => {
      const controller = new AbortController();
      controllerRef.current = controller;
      getData(controller.signal);
    },
  };
};
