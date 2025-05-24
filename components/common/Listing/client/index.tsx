"use client";

import { useMutation } from "@/components/hooks/useMutation";
import { triggerLikeListing } from "@/lib/server-actions";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ExternalLink,
  Heart,
  Image,
  MessageSquare,
  Share2,
  X,
} from "lucide-react";
import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicator,
  useCarousel,
  CarouselApi,
} from "@/components/ui/carousel";
import { Link, LinkPath } from "@/lib/routing";
import { Button } from "@/components/ui/button";
import { TextAlignedIcon } from "../../TextAlignedIcon";
import { useRouter } from "next/navigation";
import { PHOTO_SEARCH_PARAM } from "@/lib/constants";
import { useDocumentEvent } from "@/components/hooks/useKeyPress";
import { tryCatch } from "@/lib/utils";
import { ListingForPreview } from "..";

export const AvailableDateBadge = ({ date }: { date: null | string }) => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (!date) return;
    setIsAvailable(new Date(date) <= new Date());
  }, [date]);

  return (
    <Badge
      variant={"outline"}
      className={`${date === null && "text-destructive"} ${isAvailable && "text-success-foreground"}`}
    >
      {/* Available: {date ? new Date(date).toLocaleDateString() : "?"} */}
      Available {date ? new Date(date).toLocaleDateString() : "?"}
    </Badge>
  );
};

export const FooterButtons = ({
  userId,
  listing: { id, listings_likes, listing_url },
}: {
  userId: string | undefined;
  listing: Pick<ListingForPreview, "id" | "listings_likes" | "listing_url">;
}) => (
  <div className="flex w-full flex-wrap items-center justify-between gap-1">
    <div className="flex items-center justify-center gap-[inherit]">
      <LikeButton
        userId={userId}
        listingId={id}
        listings_likes={listings_likes}
      />
      <CommentButton />
    </div>
    <div className="flex items-center justify-center gap-[inherit]">
      {/* <OfficialListingButton href={listing_url} /> */}
      <ShareButton listingId={id} />
      {/* <MoreButton /> */}
    </div>
  </div>
);

const FooterButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: MouseEventHandler;
}) => (
  <Button
    size={"sm"}
    variant={"background"}
    className="h-[1.25lh] rounded-full stroke-[currentColor] px-3 py-1"
    // className="hover:bg-muted hover:text-muted-foreground bg-primary text-primary-foreground flex h-[1.25lh] items-center justify-center gap-2 rounded-full border px-3 py-1 text-sm"
    onClick={onClick}
  >
    {children}
  </Button>
);

const LikeButton = ({
  userId,
  listingId,
  listings_likes,
}: {
  userId: string | undefined;
  listingId: number;
  listings_likes: { profile_id: string }[];
}) => {
  const getDefaultState = () => ({
    isLiked: !!userId && listings_likes.some((l) => l.profile_id === userId),
    likes: listings_likes.length,
  });

  const [optimistic, setOptimistic] = useState(getDefaultState());

  const { mutate: triggerLike } = useMutation({
    mutationFn: async () => {
      if (!userId) {
        toast.info("You must be logged in to do this!");
        return;
      }
      // optimistically update state
      setOptimistic((prev) => ({
        isLiked: !prev.isLiked,
        likes: Math.max(0, prev.likes + (prev.isLiked ? -1 : 1)),
      }));

      await triggerLikeListing({
        listing_id: listingId,
        profile_id: userId,
      });
    },
    onError: (e) => {
      // revert state
      setOptimistic(getDefaultState());

      toast.error(e instanceof Error ? e.message : "Unknown error");
      console.log(e);
    },
  });

  return (
    <FooterButton onClick={triggerLike}>
      <Heart
        size={"0.875rem"}
        className="stroke-foreground"
        fill={optimistic.isLiked ? "var(--foreground)" : "var(--background)"}
      />
      <span>{optimistic.likes}</span>
    </FooterButton>
  );
};

const CommentButton = () => {
  //
  return (
    <FooterButton onClick={() => {}}>
      <MessageSquare size={"0.875rem"} />
      <span>0</span>
    </FooterButton>
  );
};

const ShareButton = ({ listingId }: { listingId: number }) => {
  // TODO I really don't need an effect for this...
  // it looks like I need to maintain an environment variable with some logic to check the current environment type

  const [url, setUrl] = useState("");
  useEffect(() => {
    const { origin } = window.location;
    const path = `/rentals/${listingId}` satisfies LinkPath;
    setUrl(origin + path);
  }, [listingId]);

  return (
    <FooterButton
      onClick={async () => {
        console.log(url);
        const tryShare = await tryCatch(
          async () =>
            await navigator.share({
              title: "Humboldt County Rentals | hcr.unxok.com",
              text: "Check out this rental!",
              url,
            }),
        );
        if (tryShare.success) return;

        const tryCopy = await tryCatch(
          async () => await navigator.clipboard.writeText(url),
        );
        if (tryCopy.success) {
          return toast.success("Copied!");
        }

        toast.error("Failed to copy! You may need to allow access first");
      }}
    >
      <Share2 size={"0.875rem"} />
      {/* <span>Share</span> */}
    </FooterButton>
  );
};

const OfficialListingButton = ({ href }: { href: string | null }) => {
  //
  return (
    href && (
      <a href={href}>
        <FooterButton onClick={() => {}}>
          <ExternalLink size={"0.875rem"} />
          <span>Official</span>
        </FooterButton>
      </a>
    )
  );
};

type FullScreenPhotoCarouselProps = {
  id: number;
  photo_urls: string[];
  index?: number;
};

export const FullScreenPhotoCarousel = ({
  id,
  photo_urls,
  index = 0,
}: FullScreenPhotoCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, index - 1));
  const [isInitted, setIsInitted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!api) return;
    if (!isInitted && index !== undefined) {
      api.scrollTo(Math.max(0, index - 1));
      setIsInitted(true);
    }
    const onSelect: Parameters<typeof api.on>[1] = (embla) => {
      const i = Math.max(0, embla.selectedScrollSnap());
      setCurrentIndex(i);
      window.history.replaceState(
        window.history.state,
        "",
        `?${PHOTO_SEARCH_PARAM}=${i + 1}` satisfies LinkPath,
      );
    };
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useDocumentEvent(
    "keydown",
    (e) => {
      // TODO BUG will move twice if arrow is clicked with mouse then corresponding arrow key is clicked without clicking anywhere else
      if (e.key === "Escape") {
        return router.back();
      }

      if (!api) return;

      if (e.key === "ArrowLeft") {
        if (e.ctrlKey) {
          return api.scrollTo(0);
        }
        return api.scrollPrev();
      }

      if (e.key === "ArrowRight") {
        if (e.ctrlKey) {
          return api.scrollTo(photo_urls.length - 1);
        }
        return api.scrollNext();
      }
    },
    [api, photo_urls],
  );

  return (
    <div className="z-header-above fixed inset-0 flex w-full items-center justify-center bg-black">
      <Carousel
        setApi={setApi}
        opts={{ align: "center" }}
        className="flex size-full items-center"
      >
        <CarouselContent className="">
          {photo_urls.map((url, index) => (
            <CarouselItem
              key={url + index}
              className="my-auto flex h-[100vh] w-[100vw] basis-full items-center justify-center"
            >
              <img
                className="size-full object-contain"
                src={url}
                alt={`Listing cover image ${index}`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant={"background"} className="left-4 scale-110" />
        <CarouselNext variant={"background"} className="right-4 scale-110" />

        <div className={"absolute bottom-6 left-1/2 z-1 -translate-x-1/2"}>
          <FullScreenPhotoCarouselNavButton
            api={api}
            currentIndex={currentIndex}
            photo_urls={photo_urls}
          />
        </div>

        <Button
          variant={"background"}
          size={"icon"}
          className="absolute top-4 right-4"
          onClick={() => {
            router.back();
          }}
        >
          <X />
        </Button>
      </Carousel>
    </div>
  );
};

const FullScreenPhotoCarouselNavButton = ({
  api,
  currentIndex,
  photo_urls,
}: {
  api: CarouselApi | undefined;
  currentIndex: number;
  photo_urls: string[];
}) => (
  <div className="bg-background flex h-[1.5lh] items-center rounded-full border px-2 text-[1rem]">
    <button
      aria-label="First photo"
      className="h-full border-0 border-r-1 p-[inherit]"
      onClick={() => {
        if (!api) return;
        api.scrollTo(0);
      }}
    >
      <ArrowLeftToLine size={"1rem"} />
    </button>
    <div className="inline-flex items-center gap-1 p-[inherit] text-sm text-nowrap">
      {/* <TextAlignedIcon icon={<Image />} /> */}
      <Image size={"1rem"} />
      {currentIndex + 1} of {api?.slideNodes().length ?? 0}
    </div>
    <button
      aria-label="Last photo"
      className="h-full border-0 border-l-1 p-[inherit]"
      onClick={() => {
        if (!api) return;
        api.scrollTo(photo_urls.length - 1);
      }}
    >
      <ArrowRightToLine size={"1rem"} />
    </button>
  </div>
);
