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

type Params = Promise<{ id?: string }>;

export type ListingForPreview = Awaited<
  ReturnType<typeof getListingsForPreview>
>["data"][number];

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = (await params).id;

  const getListing = await tryCatch(getListingById({ id: Number(id) }));

  if (!getListing.success) {
    return {
      title: "Listing not found!",
      description: "Humboldt County Rentals | hcr.unxok.com",
    };
  }

  const {
    short_description,
    address_street,
    address_street2,
    address_city,
    cover_url,
  } = getListing.data;

  const title = `${address_street?.trim()}${address_street2 ? " " + address_street2.trim() : ""}, ${address_city?.trim()}`;

  return {
    title,
    description: short_description,
    openGraph: cover_url
      ? {
          images: cover_url,
        }
      : undefined,
  };
}

export default function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<ListingCardSkeleton />}>
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
  const [listing, user] = await Promise.all([
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
      return result.data;
    })(),
    (async () => {
      const db = await createClient();
      const { data } = await db.auth.getUser();
      return data.user ?? null;
    })(),
  ]);

  return (
    <div className="px-2 py-2">
      <Listing listing={listing} user={user} />
    </div>
  );
};

const Listing = async ({
  listing,
  user,
}: {
  listing: ListingForPreview;
  user: User | null;
}) => {
  return (
    <div>
      <ListingCard listing={listing} userId={user?.id} isPage={true} />
    </div>
  );
};
