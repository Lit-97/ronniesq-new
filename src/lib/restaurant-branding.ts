import { cache } from "react";

import {
  getPublicSupabaseClient,
} from "@/lib/supabase-public";

import {
  MEDIA_BUCKET,
} from "@/lib/media-constants";

const DEFAULT_HEADER_LOGO_PATH =
  "/images/ronnies-logo.png";

export type RestaurantBrandingInfo = {
  headerLogoPath: string;
  source: "supabase" | "fallback";
};

type RestaurantBrandingRow = {
  header_logo_path: string | null;
};

function resolveBrandingImagePath(
  imagePath: string,
  supabase: NonNullable<
    ReturnType<
      typeof getPublicSupabaseClient
    >
  >,
): string {
  /*
   * Local /public image fallback.
   */
  if (
    imagePath.startsWith("/")
  ) {
    return imagePath;
  }

  /*
   * Already a complete URL.
   */
  if (
    imagePath.startsWith(
      "https://",
    ) ||
    imagePath.startsWith(
      "http://",
    )
  ) {
    return imagePath;
  }

  /*
   * Media Library storage path:
   *
   * branding/12345-logo.png
   */
  const {
    data: publicUrlData,
  } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(imagePath);

  return publicUrlData.publicUrl;
}

export const getRestaurantBrandingInfo =
  cache(
    async (): Promise<
      RestaurantBrandingInfo
    > => {
      const supabase =
        getPublicSupabaseClient();

      if (!supabase) {
        return {
          headerLogoPath:
            DEFAULT_HEADER_LOGO_PATH,

          source:
            "fallback",
        };
      }

      const {
        data,
        error,
      } = await supabase
        .from(
          "restaurant_settings",
        )
        .select(
          "header_logo_path",
        )
        .eq(
          "id",
          1,
        )
        .maybeSingle();

      if (
        error ||
        !data
      ) {
        if (error) {
          console.error(
            "Unable to load restaurant branding:",
            error,
          );
        }

        return {
          headerLogoPath:
            DEFAULT_HEADER_LOGO_PATH,

          source:
            "fallback",
        };
      }

      const row =
        data as RestaurantBrandingRow;

      const storedLogoPath =
        row.header_logo_path
          ?.trim() ||
        DEFAULT_HEADER_LOGO_PATH;

      return {
        headerLogoPath:
          resolveBrandingImagePath(
            storedLogoPath,
            supabase,
          ),

        source:
          "supabase",
      };
    },
  );