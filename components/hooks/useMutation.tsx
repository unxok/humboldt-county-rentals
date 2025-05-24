import { tryCatch } from "@/lib/utils";
import { useState } from "react";

export const useMutation = <T,>({
  mutationFn,
  onError,
  onSuccess,
}: {
  mutationFn: (args: T) => void | Promise<void>;
  onError?: (e: unknown) => void | Promise<void>;
  onSuccess?: () => void | Promise<void>;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>();

  const mutate = async (...params: Parameters<typeof mutationFn>) => {
    setIsPending(true);
    const result = await tryCatch(async () => {
      await mutationFn(...params);
    });
    setIsPending(false);
    if (!result.success) {
      setError(result.error);
      if (onError) {
        await onError(result.error);
      }
      return;
    }
    if (onSuccess) {
      const maybePromise = onSuccess();
      if (!(maybePromise instanceof Promise)) return;
      await maybePromise;
    }
  };

  return {
    mutate,
    error,
    isPending,
    isError: error !== null && error !== undefined,
  };
};
