import "server-only";
import { createClient } from "../supabase/server";
import { clamp, toNumberNotNaN, tryCatch } from "../utils";
import { FiltersSchema } from "@/components/common/ListingFilters/shared";
import { User } from "@supabase/supabase-js";

/**
 * Get the username of the currently logged in user
 * @deprecated use `getOwnUser` instead. It does the same amount of work but returns both User and username
 */
export const getOwnUsername = async (): Promise<string | null> => {
  const db = await createClient();

  const getUserResult = await tryCatch(db.auth.getUser());
  if (!getUserResult.success) {
    console.error("getUser threw: ", getUserResult.error);
    return null;
  }
  const getUser = getUserResult.data;
  if (getUser.error) return null;
  const { id } = getUser.data.user;
  const getUsername = await db.from("profiles").select("username").eq("id", id);
  if (getUsername.error || !getUsername.data[0]) return null;
  return getUsername.data[0].username;
};

/**
 * Get the User and username from the current session
 * @throws If no user is found, probably from not being logged in
 */
export const getOwnUser = async (): Promise<{
  user: User;
  username: string;
}> => {
  const db = await createClient();

  const getUserResult = await tryCatch(db.auth.getUser());
  if (!getUserResult.success) {
    throw new Error(getUserResult.error);
  }
  const getUser = getUserResult.data;
  if (getUser.error) {
    throw new Error(getUser.error.message);
  }
  const { user } = getUser.data;
  const { id } = user;
  const getUsername = await db.from("profiles").select("username").eq("id", id);
  if (getUsername.error) {
    throw new Error(getUsername.error.message);
  }
  const username = getUsername.data[0]?.username;
  if (username === undefined) {
    throw new Error("Username not found");
  }
  return { user, username };
};

const listingCols =
  "id, cover_url, photo_urls, created_at, listing_url, long_description, short_description, bedrooms, bathrooms, is_cats_allowed, is_dogs_allowed, rent_price, deposit_price, address_street, address_street2, address_zip, address_state, address_city, available_date, square_feet, property_owners (name, branding_color, text_color, logo_url), listings_likes (profile_id)" as const;

/**
 * Get currently listed rentals
 * @throws If DB error
 */
export const getListingsForPreview = async (options: {
  pageNumber: number;
  filters?: FiltersSchema;
}) => {
  const db = await createClient();

  const pageNumber = toNumberNotNaN(options.pageNumber, 1);
  const limit = 20;
  const startIndex = limit * (pageNumber - 1);
  const endIndex = limit * pageNumber - 1;

  const query = db
    .schema("hcr")
    .from("listings")
    .select(listingCols, { count: "exact" })
    .eq("is_admin_hidden", false)
    .eq("is_listed", true)
    .range(startIndex, endIndex);

  if (options.filters) {
    const toArray = <T>(x: T | T[]) => (Array.isArray(x) ? x : [x]);

    const {
      rentMin = 0,
      rentMax = 0,
      depMin = 0,
      depMax = 0,
      cats,
      dogs,
      beds,
      baths,
      cities,
      owners,
    } = options.filters;

    query.gte("rent_price", rentMin).gte("deposit_price", depMin);

    if (rentMax > 0) {
      query.lte("rent_price", rentMax);
    }
    if (depMax > 0) {
      query.lte("deposit_price", depMax);
    }
    if (cats) {
      query.eq("is_cats_allowed", true);
    }
    if (dogs) {
      query.eq("is_dogs_allowed", true);
    }
    if (beds) {
      query.in("bedrooms", toArray(beds));
    }
    if (baths) {
      query.in("bathrooms", toArray(baths));
    }
    if (cities) {
      query.in("address_city", toArray(cities));
    }
    if (owners) {
      query.in("property_owner_id", toArray(owners));
    }
  }

  const { data, error, count: countOrNull } = await query;
  if (error) {
    throw new Error("Failed to query listings:\n " + error.message);
  }

  const count = countOrNull ?? 0;
  const start = startIndex + 1;
  const end = endIndex + 1 > count ? count : endIndex + 1;
  const totalPages = Math.ceil(count / limit);
  const truePageNumber = clamp(pageNumber, {
    min: 1,
    max: totalPages,
    inclusive: true,
  });
  const prevPageNumber = Math.max(1, truePageNumber - 1);
  const nextPageNumber = Math.min(totalPages, truePageNumber + 1);

  return {
    data,
    count,
    start,
    end,
    truePageNumber,
    totalPages,
    prevPageNumber,
    nextPageNumber,
  };
};

/**
 * Get a specific rental by id if it is currently listed.
 * @throws If error in DB or listing is not found
 */
export const getListingById = async ({ id }: { id: number }) => {
  const db = await createClient();

  const { data, error } = await db
    .schema("hcr")
    .from("listings")
    .select(listingCols)
    .eq("is_admin_hidden", false)
    .eq("is_listed", true)
    .eq("id", id)
    .limit(1);
  if (error) {
    throw new Error(error.message);
  }
  const listing = data[0];
  if (!listing) {
    throw new Error("Rental not found");
  }
  return listing;
};

export const getFilterInfo = async () => {
  const db = await createClient();

  const { data, error } = await db
    .schema("hcr")
    .rpc("get_listings_filter_info");
  if (error) {
    throw new Error(error.message);
  }

  if (!data[0]) {
    throw new Error("Filter info was empty");
  }

  return data[0];
};
