"use client";
import { Button } from "@/components/ui/button";
import { ComponentProps, ReactNode } from "react";

const opts: ScrollIntoViewOptions = {
  behavior: "instant",
  block: "nearest",
  inline: "start",
};

export const ScrollTo = ({
  selector,
  ...props
}: {
  selector: string;
} & Omit<ComponentProps<"div">, "onClick">) => (
  <div
    {...props}
    onClick={() => {
      const el = document.querySelector(selector);
      if (!el)
        return console.log(`Element not found by selector "${selector}"`);
      el.scrollIntoView(opts);
    }}
  />
);
