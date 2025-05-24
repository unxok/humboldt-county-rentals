import { getListingById, getListingsForPreview } from "@/lib/server-only";
import { createClient } from "@/lib/supabase/server";
import { SearchParams } from "next/dist/server/request/search-params";
import { Suspense } from "react";
import { ListingCardSkeleton, ListingCard } from "@/components/common/Listing";
import { notFound } from "next/navigation";
import { toNumberNotNaN, tryCatch } from "@/lib/utils";
import { PHOTO_SEARCH_PARAM, RETURN_URL_SEARCH_PARAM } from "@/lib/constants";
import { FullScreenPhotoCarousel } from "@/components/common/Listing/client";
import { User } from "@supabase/supabase-js";
import { Metadata, ResolvingMetadata } from "next";
import { ImageResponse } from "next/og";
import { redirect } from "@/lib/routing";
import { Loader2 } from "lucide-react";

type Params = Promise<{ id?: string }>;

export type ListingForPreview = Awaited<
  ReturnType<typeof getListingsForPreview>
>["data"][number];

export default function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense
      fallback={
        <div className="z-header-above fixed inset-0 flex items-center justify-center bg-neutral-950">
          <Loader2 className="animate-spin text-neutral-300" />
        </div>
      }
    >
      <Async params={params} searchParams={searchParams} />
    </Suspense>
  );
}

const Async = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<SearchParams>;
}) => {
  const [listing, selectedPhoto] = await Promise.all([
    (async () => {
      const p = await params;
      const maybeId = p?.id;
      const id = Number(maybeId);
      if (maybeId === undefined || Number.isNaN(id)) notFound();

      const result = await tryCatch(getListingById({ id }));
      if (!result.success) {
        console.error(result.error);
        notFound();
      }
      if (!result.data.photo_urls) {
        redirect(`/rentals/${result.data.id}/404`);
      }
      return result.data;
    })(),
    (async () => {
      const sp = await searchParams;
      const photoParam = sp?.[PHOTO_SEARCH_PARAM];
      if (photoParam === undefined) return 1;
      const selectedPhoto = toNumberNotNaN(
        Array.isArray(photoParam) ? photoParam[0] : photoParam,
        1,
      );
      return selectedPhoto;
    })(),
  ]);

  return (
    <>
      {!!listing.photo_urls && (
        <FullScreenPhotoCarousel
          id={listing.id}
          photo_urls={listing.photo_urls}
          index={selectedPhoto}
        />
      )}
    </>
  );
};
