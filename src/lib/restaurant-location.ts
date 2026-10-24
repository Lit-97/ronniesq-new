import { getPublicSupabaseClient } from "@/lib/supabase-public";

export type RestaurantLocationInfo = {
  streetAddress: string;
  city: string;
  stateCode: string;
  postalCode: string;

  cityState: string;
  fullAddress: string;

  mapUrl: string;
  mapEmbedUrl: string;

  source: "supabase" | "fallback";
};

const DEFAULT_RESTAURANT_LOCATION = {
  streetAddress: "300B Henslee Dr",
  city: "Dickson",
  stateCode: "TN",
  postalCode: "37055",
  mapUrl:
    "https://maps.app.goo.gl/NdW7gtGsnGGtcL9aA",
};

function buildLocationInfo(
  location: typeof DEFAULT_RESTAURANT_LOCATION,
  source: RestaurantLocationInfo["source"],
): RestaurantLocationInfo {
  const cityState =
    `${location.city}, ${location.stateCode}`;

  const fullAddress =
    `${location.streetAddress}, ` +
    `${location.city}, ` +
    `${location.stateCode} ` +
    `${location.postalCode}`;

  const encodedAddress =
    encodeURIComponent(fullAddress);

  return {
    ...location,
    cityState,
    fullAddress,

    mapEmbedUrl:
      `https://www.google.com/maps?q=${encodedAddress}&output=embed`,

    source,
  };
}

export async function getRestaurantLocationInfo(): Promise<RestaurantLocationInfo> {
  const supabase =
    getPublicSupabaseClient();

  if (!supabase) {
    return buildLocationInfo(
      DEFAULT_RESTAURANT_LOCATION,
      "fallback",
    );
  }

  const { data, error } = await supabase
    .from("restaurant_settings")
    .select(
      `
        street_address,
        city,
        state_code,
        postal_code,
        map_url
      `,
    )
    .eq("id", 1)
    .maybeSingle();

  if (
    error ||
    !data?.street_address ||
    !data?.city ||
    !data?.state_code ||
    !data?.postal_code ||
    !data?.map_url
  ) {
    if (error) {
      console.error(
        "Unable to load restaurant location information:",
        error,
      );
    }

    return buildLocationInfo(
      DEFAULT_RESTAURANT_LOCATION,
      "fallback",
    );
  }

  return buildLocationInfo(
    {
      streetAddress:
        data.street_address,
      city:
        data.city,
      stateCode:
        data.state_code,
      postalCode:
        data.postal_code,
      mapUrl:
        data.map_url,
    },
    "supabase",
  );
}