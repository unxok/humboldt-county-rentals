import { getFilterInfo, getListingsForPreview } from "@/lib/server-only";
import { createClient } from "@/lib/supabase/server";
import { SearchParams } from "next/dist/server/request/search-params";
import { Suspense } from "react";
import { ListingCardSkeleton, ListingCard } from "@/components/common/Listing";
import {
  PaginationNav,
  PaginationNavSkeleton,
} from "@/components/common/PaginationNav";
import {
  parseSearchParams,
  stripFalseyish,
  toNumberNotNaN,
  tryCatch,
} from "@/lib/utils";
import {
  ERROR_SEARCH_PARAM,
  PAGE_SEARCH_PARAM,
  RETURN_URL_SEARCH_PARAM,
} from "@/lib/constants";
import { LinkPath, redirect } from "@/lib/routing";
import { Filters } from "@/components/common/ListingFilters/client";
import {
  filtersSchema,
  defaultFilters,
} from "@/components/common/ListingFilters/shared";
import { FiltersSkeleton } from "@/components/common/ListingFilters";
import { Skeleton } from "@/components/ui/skeleton";

export type ListingForPreview = Awaited<
  ReturnType<typeof getListingsForPreview>
>["data"][number];

export const dynamic = "force-dynamic";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="px-2 py-2">
      <h2 className="sr-only">Rentals</h2>
      <Suspense fallback={<ListingsSkeleton />}>
        <Listings searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const Listings = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const [[getListings, appliedFilters, sp], user, filterInfo] =
    await Promise.all([
      (async () => {
        const sp = stripFalseyish(parseSearchParams(await searchParams));
        const parsed = filtersSchema.safeParse(sp);
        const appliedFilters = {
          ...defaultFilters,
          ...(parsed.success ? parsed.data : {}),
        };
        const pageNumber = toNumberNotNaN(sp?.["page"], 1);
        const getListings = await tryCatch(
          getListingsForPreview({ pageNumber, filters: appliedFilters }),
        );
        if (!getListings.success) {
          return redirect(`/error`, undefined, {
            [ERROR_SEARCH_PARAM]: getListings.error,
            [RETURN_URL_SEARCH_PARAM]: "/rentals" satisfies LinkPath,
          });
        }
        return [getListings.data, appliedFilters, sp];
      })(),
      (async () => {
        const db = await createClient();
        const { data } = await db.auth.getUser();
        return data.user ?? null;
      })(),
      getFilterInfo(),
    ]);

  const searchParamsToString = (sp: SearchParams) => {
    return Object.entries(sp)
      .map(([k, v]) =>
        k === PAGE_SEARCH_PARAM
          ? ""
          : k + "=" + encodeURIComponent(v?.toString() ?? ""),
      )
      .join("&");
  };

  return (
    getListings.count !== null && (
      <div className="flex size-full flex-col gap-3">
        <Filters
          key={searchParamsToString(sp)}
          appliedFilters={appliedFilters}
          filterInfo={filterInfo}
          pageNumber={getListings.truePageNumber}
        />
        <PaginationNav
          pageNumber={getListings.truePageNumber}
          total={getListings.totalPages}
          prevHref={`/rentals?${searchParamsToString({ ...sp, [PAGE_SEARCH_PARAM]: getListings.prevPageNumber.toString() })}`}
          nextHref={`/rentals?${searchParamsToString({ ...sp, [PAGE_SEARCH_PARAM]: "1" })}`}
          firstHref={`/rentals?${searchParamsToString({ ...sp, [PAGE_SEARCH_PARAM]: getListings.prevPageNumber.toString() })}`}
          lastHref={`/rentals?${searchParamsToString({ ...sp, [PAGE_SEARCH_PARAM]: getListings.totalPages.toString() })}`}
        />
        <span className="text-muted-foreground">
          Showing {getListings.start} - {getListings.end} of {getListings.count}{" "}
          rentals
        </span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
          {getListings.data.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              userId={user?.id}
              isPage={false}
            />
          ))}
        </div>
        <PaginationNav
          pageNumber={getListings.truePageNumber}
          total={getListings.totalPages}
          prevHref={`/rentals?${searchParamsToString(sp)}${PAGE_SEARCH_PARAM}=${getListings.prevPageNumber}`}
          nextHref={`/rentals?${searchParamsToString(sp)}${PAGE_SEARCH_PARAM}=${getListings.nextPageNumber}`}
        />
      </div>
    )
  );
};

const ListingsSkeleton = () => (
  <div className="flex size-full flex-col gap-3">
    <FiltersSkeleton />
    <PaginationNavSkeleton />
    <Skeleton className="w-[10ch]">&nbsp;</Skeleton>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 5 }, (_, i) => (
        <ListingCardSkeleton key={"listing-skeleton" + i} />
      ))}
    </div>
    <PaginationNavSkeleton />
  </div>
);
