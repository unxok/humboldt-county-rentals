import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export const MultiSelectPills = <T,>({
  value,
  setValue,
  options,
  className,
}: {
  value: T[] | T;
  setValue: (cb: (prev: T[] | T) => T[]) => void;
  options: { label: string; value: T }[];
  className?: string;
}) => {
  const set = useMemo(
    () => new Set(Array.isArray(value) ? value : [value]),
    [value],
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {options.map((o) => (
        <Button
          key={"multi-select-pill" + o.label + o.value}
          data-selected={set.has(o.value)}
          variant={"outline"}
          size={"sm"}
          className={`data-[selected=true]:bg-primary dark:data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground rounded-full px-5 text-xs`}
          onClick={() => {
            setValue((prev) => {
              const arr = Array.isArray(prev) ? prev : [prev];
              if (set.has(o.value)) {
                return arr.filter((v) => v !== o.value);
              }
              return [...arr, o.value];
            });
          }}
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
};
