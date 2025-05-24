import { getListingsForPreview } from "@/lib/server-only";

import {
  ChevronsDownUp,
  ChevronsUpDown,
  ExternalLink,
  MapPin,
  Star,
} from "lucide-react";
import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FooterButtons } from "./client";
import { PhotoCarousel, InfoBadges } from "./server";
import { cn } from "@/lib/utils";
import { TextAlignedIcon } from "../TextAlignedIcon";
import { Link, LinkPath } from "@/lib/routing";

export type ListingForPreview = Awaited<
  ReturnType<typeof getListingsForPreview>
>["data"][number];

export const ListingCardPresentational = ({
  propertyOwnerButton,
  photoCarousel,
  streetAddress,
  rentPrice,
  cityName,
  shortDescription,
  infoBadges,
  longDescription,
  footerButtons,
  className,
  href,
}: {
  propertyOwnerButton: ReactNode;
  photoCarousel: ReactNode;
  streetAddress: ReactNode;
  rentPrice: ReactNode;
  cityName: ReactNode;
  shortDescription: ReactNode;
  infoBadges: ReactNode;
  longDescription: ReactNode;
  footerButtons: ReactNode;
  className?: string;
  href?: LinkPath;
}) => {
  const cardContent = (
    <>
      <CardTitle className="flex justify-between gap-1">
        <h3 className="xs:text-2xl text-lg">{streetAddress}</h3>
        <div className="text-success-foreground xs:text-xl text-lg">
          {rentPrice}
        </div>
      </CardTitle>
      <CardDescription className="line-clamp-2 flex items-center gap-[.5ch]">
        {cityName}
      </CardDescription>
      {infoBadges}
      <div className="py-1">{shortDescription}</div>
      {longDescription}
    </>
  );

  return (
    <Card
      className={cn(
        'w-full grow gap-1 py-0 has-[[data-slot="accordion-item"][data-state="open"]]:row-span-2',
        className,
      )}
    >
      <CardHeader className="relative overflow-hidden rounded-[inherit] rounded-b-none px-0">
        <div className="absolute top-2 right-2 z-1">{propertyOwnerButton}</div>
        <div className="h-(--img-height) w-full overflow-hidden bg-neutral-950 [--img-height:14rem]">
          {photoCarousel}
        </div>
      </CardHeader>
      {href === undefined && (
        <CardContent className="flex flex-col gap-1 px-3">
          {cardContent}
        </CardContent>
      )}
      {href !== undefined && (
        <Link href={href}>
          <CardContent className="flex flex-col gap-1 px-3">
            {cardContent}
          </CardContent>
        </Link>
      )}
      <CardFooter className="border-0 border-t-1 px-3 py-2">
        {footerButtons}
      </CardFooter>
    </Card>
  );
};

export const ListingCardSkeleton = () => (
  <ListingCardPresentational
    propertyOwnerButton={<Skeleton className="w-12">&nbsp;</Skeleton>}
    photoCarousel={null}
    streetAddress={<Skeleton className="w-36">&nbsp;</Skeleton>}
    rentPrice={<Skeleton className="w-16">&nbsp;</Skeleton>}
    cityName={<Skeleton className="w-12">&nbsp;</Skeleton>}
    shortDescription={
      <div className="h-[2lh]">
        <Skeleton className="w-12">&nbsp;</Skeleton>
        <p>&nbsp;</p>
      </div>
    }
    infoBadges={
      <div className="flex flex-wrap gap-2">
        <Skeleton>0 Bd</Skeleton>
        <Skeleton>0 Ba</Skeleton>
        <Skeleton>Cats 0</Skeleton>
        <Skeleton>Dogs 0</Skeleton>
        <Skeleton>$0,000 deposit</Skeleton>
        <Skeleton>0,000 Ft2</Skeleton>
        <Skeleton>Listed 0/0/0000</Skeleton>
        <Skeleton>Available 0/0/0000</Skeleton>
      </div>
    }
    longDescription={null}
    footerButtons={
      <div className="flex w-full flex-wrap justify-between gap-2">
        <div className="flex flex-wrap items-center gap-[inherit]">
          <Skeleton className="w-12">&nbsp;</Skeleton>
          <Skeleton className="w-12">&nbsp;</Skeleton>
        </div>
        <div className="flex flex-wrap items-center gap-[inherit]">
          <Skeleton className="w-8">&nbsp;</Skeleton>
        </div>
      </div>
    }
  />
);

export const ListingCard = ({
  listing: {
    address_street,
    address_street2,
    address_city,
    address_state,
    address_zip,
    short_description,
    property_owners,
    rent_price,
    photo_urls,
    id,
    listings_likes,
    listing_url,
    bedrooms,
    bathrooms,
    is_cats_allowed,
    is_dogs_allowed,
    deposit_price,
    available_date,
    created_at,
    square_feet,
    long_description,
  },
  userId,
  isPage,
}: {
  listing: ListingForPreview;
  userId?: string;
  isPage: boolean;
}) => {
  return (
    <ListingCardPresentational
      propertyOwnerButton={
        <>
          {listing_url && (
            <a
              className={cn(
                buttonVariants({ variant: "background", size: "sm" }),
                "gap-0.5 rounded-full font-semibold",
              )}
              href={listing_url}
            >
              {property_owners.name}
              <ExternalLink className="size-4" />
            </a>
          )}
          {!listing_url && (
            <Button
              className={"gap-0.5 rounded-full font-semibold"}
              variant={"background"}
              size={"sm"}
            >
              {property_owners.name}
            </Button>
          )}
        </>
      }
      photoCarousel={
        <div id={`listing-${id}`}>
          <PhotoCarousel id={id} photo_urls={photo_urls} isPage={isPage} />
        </div>
      }
      streetAddress={
        <span
          className={`${isPage ? "" : "line-clamp-1"}`}
          title={formatStreetAddress({ address_street, address_street2 })}
        >
          {formatStreetAddress({ address_street, address_street2 })}
        </span>
      }
      rentPrice={
        <span
          style={{
            color: rent_price === null ? "var(--destructive)" : undefined,
          }}
        >
          ${rent_price?.toLocaleString() ?? "?"}
        </span>
      }
      cityName={
        <>
          <MapPin size={"1rem"} />
          {/* <span>
            {address_street?.trim() ?? "?"}
            {", "}
            {address_city?.trim() ?? "?"}
          </span> */}
          <span>
            {address_city?.trim() ?? "?"} {address_zip?.slice(0, 5)}
          </span>
        </>
      }
      shortDescription={
        <span className="line-clamp-2 h-[2lh]">{short_description}</span>
      }
      infoBadges={
        <InfoBadges
          listing={{
            bedrooms,
            bathrooms,
            is_cats_allowed,
            is_dogs_allowed,
            deposit_price,
            available_date,
            created_at,
            square_feet,
          }}
        />
      }
      longDescription={
        isPage
          ? long_description && (
              <Collapsible className="mt-2 rounded-md border p-2">
                <CollapsibleTrigger className="group flex w-full flex-col text-start">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Full description</h4>
                    <div className="text-muted-foreground group-hover:text-foreground flex items-center gap-1 font-semibold group-data-[state=closed]:hidden">
                      Collapse
                      <TextAlignedIcon icon={<ChevronsDownUp />} />
                    </div>
                  </div>
                  <div
                    className="text-muted-foreground line-clamp-5 wrap-anywhere group-data-[state=open]:hidden"
                    dangerouslySetInnerHTML={
                      //This is sanitized server side before uploading to DB
                      { __html: long_description }
                    }
                  />
                  <div className="text-muted-foreground group-hover:text-foreground flex w-full justify-center">
                    <span className="flex items-center gap-1 group-data-[state=open]:hidden">
                      Show all
                      <TextAlignedIcon icon={<ChevronsUpDown />} />
                    </span>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div
                    className="w-full wrap-anywhere"
                    dangerouslySetInnerHTML={
                      //This is sanitized server side before uploading to DB
                      { __html: long_description }
                    }
                  />
                  <CollapsibleTrigger className="text-muted-foreground group-hover:text-foreground flex w-full items-center justify-center gap-1 font-semibold group-data-[state=closed]:hidden">
                    Collapse
                    <TextAlignedIcon icon={<ChevronsDownUp />} />
                  </CollapsibleTrigger>
                </CollapsibleContent>
              </Collapsible>
            )
          : null
      }
      footerButtons={
        <FooterButtons
          userId={userId}
          listing={{ id, listing_url, listings_likes }}
        />
      }
      href={isPage ? undefined : `/rentals/${id}`}
    />
  );
};

const formatAddress = ({
  address_street,
  address_street2,
  address_city,
  address_state,
  address_zip,
}: Pick<
  ListingForPreview,
  | "address_street"
  | "address_street2"
  | "address_city"
  | "address_state"
  | "address_zip"
>) => {
  return `${address_street?.trim() ?? "?"}${address_street2 ? " " + address_street2.trim() : ""}, ${address_city?.trim() ?? "?"}, ${address_state?.trim() ?? "?"} ${address_zip?.slice(0, 5)}`;
};

const formatStreetAddress = ({
  address_street,
  address_street2,
}: Pick<ListingForPreview, "address_street" | "address_street2">) =>
  `${address_street?.trim() ?? "?"}${address_street2 ? " " + address_street2.trim() : ""}`;
