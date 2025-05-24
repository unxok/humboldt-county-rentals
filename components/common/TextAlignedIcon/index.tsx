import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const TextAlignedIcon = ({
  icon,
  height,
  className,
}: {
  icon: ReactNode;
  height?: string;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "pt-[calc(var(--height)*0.2)] [&>svg]:h-[calc(var(--height)*0.875)] [&>svg]:w-[calc(var(--height)*0.8)]",
        className,
      )}
      style={{
        "--height": height ?? "1.125rem",
      }}
    >
      {icon}
    </span>
  );
};
