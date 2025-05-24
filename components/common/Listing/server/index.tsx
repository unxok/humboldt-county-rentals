import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ListingForPreview } from "..";
import { AvailableDateBadge } from "../client";
import { Link } from "@/lib/routing";
import { PHOTO_SEARCH_PARAM } from "@/lib/constants";
import { Portal } from "@radix-ui/react-portal";

export const CheckOrXOrQuestionMark = ({
  constraint,
}: {
  constraint: boolean | null;
}) => (
  <>
    {constraint === true && <>&#10003;</>}
    {constraint === false && <>&#10005;</>}
    {constraint === null && <>?</>}
  </>
);

export const InfoBadges = ({
  listing: {
    bedrooms,
    bathrooms,
    is_cats_allowed,
    is_dogs_allowed,
    deposit_price,
    available_date,
    created_at,
    square_feet,
  },
}: {
  listing: Pick<
    ListingForPreview,
    | "bedrooms"
    | "bathrooms"
    | "is_cats_allowed"
    | "is_dogs_allowed"
    | "deposit_price"
    | "available_date"
    | "created_at"
    | "square_feet"
  >;
}) => (
  <div className="flex flex-wrap items-center justify-start gap-2 pt-4">
    <Badge
      className={`${bedrooms === null && "text-destructive"}`}
      variant={"outline"}
    >
      {/* Bedrooms: {bedrooms ?? "?"} */}
      {bedrooms ?? "?"} Bd
    </Badge>
    <Badge
      className={`${bathrooms === null && "text-destructive"}`}
      variant={"outline"}
    >
      {/* Bathrooms: {bathrooms ?? "?"} */}
      {bathrooms ?? "?"} Ba
    </Badge>
    <Badge
      variant={"outline"}
      className={`${!is_cats_allowed && "text-destructive"}`}
    >
      {/* Cats: <CheckOrXOrQuestionMark constraint={is_cats_allowed} /> */}
      Cats <CheckOrXOrQuestionMark constraint={is_cats_allowed} />
    </Badge>
    <Badge
      variant={"outline"}
      className={`${!is_dogs_allowed && "text-destructive"}`}
    >
      {/* Dogs: <CheckOrXOrQuestionMark constraint={is_dogs_allowed} /> */}
      Dogs <CheckOrXOrQuestionMark constraint={is_dogs_allowed} />
    </Badge>
    <Badge
      variant={"outline"}
      className={`${deposit_price === null && "text-destructive"}`}
    >
      {/* Deposit: ${deposit_price?.toLocaleString() ?? "?"} */}$
      {deposit_price?.toLocaleString() ?? "?"} Deposit
    </Badge>
    <Badge
      variant={"outline"}
      className={`${square_feet === null && "text-destructive"}`}
    >
      {/* Sq feet: {square_feet?.toLocaleString() ?? "?"} */}
      {square_feet?.toLocaleString() ?? "?"} Ft<sup>2</sup>
    </Badge>
    <AvailableDateBadge date={available_date} />
    <Badge variant={"outline"}>
      {/* Listed:{" "}{created_at !== null ? new Date(created_at).toLocaleDateString() : "?"} */}
      Listed{" "}
      {created_at !== null ? new Date(created_at).toLocaleDateString() : "?"}
    </Badge>
  </div>
);

export const PhotoCarousel = ({
  id,
  photo_urls,
  isPage,
}: {
  id: number;
  photo_urls: string[] | null;
  isPage: boolean;
}) => {
  return (
    photo_urls && (
      <Carousel
        className="w-full max-w-full overflow-hidden"
        opts={{ align: "start" }}
      >
        <CarouselContent className="h-(--img-height)">
          {photo_urls.map((url, index) => (
            <CarouselItem
              key={url + index}
              data-is-page={isPage}
              className="flex h-full basis-full justify-center"
            >
              <Link
                href={`/rentals/${id}/pics/?${PHOTO_SEARCH_PARAM}=${index + 1}`}
                className="flex size-full items-center justify-center"
              >
                <img
                  loading="lazy"
                  height={288}
                  className="size-full object-contain"
                  src={url}
                  alt="Listing cover image"
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant={"background"} className="left-2" />
        <CarouselNext variant={"background"} className="right-2" />
        <CarouselIndicator className="pointer-events-none" />
      </Carousel>
    )
  );
};
