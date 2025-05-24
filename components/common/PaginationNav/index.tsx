import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, LinkPath } from "@/lib/routing";
import { cn } from "@/lib/utils";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ComponentProps, ReactNode } from "react";

type PaginationProps = {
  pageNumber: number;
  total: number;
  prevHref?: LinkPath;
  nextHref?: LinkPath;
  firstHref?: LinkPath;
  lastHref?: LinkPath;
};

const Presentational = ({
  centerText,
  prevHref,
  nextHref,
  firstHref,
  lastHref,
}: {
  centerText: ReactNode;
  prevHref?: LinkPath;
  nextHref?: LinkPath;
  firstHref?: LinkPath;
  lastHref?: LinkPath;
}) => (
  <nav className="bg-card text-card-foreground flex items-center justify-between rounded-md border p-1">
    <div className="flex gap-2">
      <DisableLink href={firstHref} className="xs:flex hidden">
        <ChevronFirst />
      </DisableLink>
      <DisableLink href={prevHref}>
        <ChevronLeft />
      </DisableLink>
    </div>
    <span>{centerText}</span>
    <div className="flex gap-2">
      <DisableLink href={nextHref} className="">
        <ChevronRight />
      </DisableLink>
      <DisableLink href={lastHref} className="xs:flex hidden">
        <ChevronLast />
      </DisableLink>
    </div>
  </nav>
);

export const PaginationNavSkeleton = () => (
  <Presentational
    centerText={<Skeleton className="w-[10ch]">&nbsp;</Skeleton>}
  />
);

export const PaginationNav = ({
  pageNumber,
  total,
  prevHref,
  nextHref,
  firstHref,
  lastHref,
}: PaginationProps) => {
  return (
    <Presentational
      centerText={
        <>
          Page {pageNumber} of {total} total
        </>
      }
      prevHref={prevHref}
      nextHref={nextHref}
      firstHref={firstHref}
      lastHref={lastHref}
    />
  );
};

type Variant = NonNullable<Parameters<typeof buttonVariants>[0]>["variant"];

type DisableLinkProps = ComponentProps<typeof Button> & {
  children: ReactNode;
  href: LinkPath | undefined;
  variant?: Variant;
  className?: string;
};
const DisableLink = ({
  children,
  href,
  variant = "ghost",
  className,
}: DisableLinkProps) => {
  const defaultClassName = "has-[>svg]:p-2 h-full";

  return (
    <>
      {!!href && (
        <Link
          href={href}
          className={cn(
            buttonVariants({ variant }),
            defaultClassName,
            className,
          )}
        >
          {children}
        </Link>
      )}
      {!href && (
        <Button
          disabled
          variant={variant}
          size={"icon"}
          className={cn(defaultClassName, className)}
        >
          {children}
        </Button>
      )}
    </>
  );
};
