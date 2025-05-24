"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/router";
import { ComponentProps } from "react";

export const GoBackButton = ({
  onClick,
  className,
  ...props
}: ComponentProps<typeof Button>) => {
  return (
    <Button
      variant={"default"}
      className={cn("gap-1", className)}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
        if (e.isDefaultPrevented()) return;
        window.history.back();
      }}
      {...props}
    >
      <ChevronLeft />
      Go back
    </Button>
  );
};
