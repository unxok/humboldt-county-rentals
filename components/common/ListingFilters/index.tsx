import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

export const FiltersPresentational = ({
  filtersCount,
  collapsibleContent,
  isDisabled,
}: {
  filtersCount: ReactNode;
  collapsibleContent: ReactNode;
  isDisabled: boolean;
}) => (
  <Collapsible className="bg-card text-card-foreground rounded-md border p-2">
    <CollapsibleTrigger
      disabled={isDisabled}
      className="flex w-full items-center justify-between font-semibold [&>svg]:transition-all data-[state=open]:[&>svg]:rotate-180"
    >
      <div className="flex items-center gap-1">
        <span>Filters</span>
        {filtersCount}
      </div>{" "}
      <ChevronDown size={"1rem"} />
    </CollapsibleTrigger>
    <CollapsibleContent animate={true}>{collapsibleContent}</CollapsibleContent>
  </Collapsible>
);

export const FiltersSkeleton = () => (
  <FiltersPresentational
    filtersCount={
      <Skeleton className="rounded-lg px-3 py-1 text-xs">&nbsp;</Skeleton>
    }
    collapsibleContent={null}
    isDisabled={true}
  />
);
