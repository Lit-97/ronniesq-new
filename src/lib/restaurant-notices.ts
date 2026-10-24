import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase-public";

export const RESTAURANT_NOTICE_KEYS = [
  "menu-photo-disclaimer",
  "same-day-order-notice",
  "online-ordering-notice",
] as const;

export type RestaurantNoticeKey =
  (typeof RESTAURANT_NOTICE_KEYS)[number];

export type RestaurantNotice = {
  key: RestaurantNoticeKey;
  title: string;
  description: string;
  message: string;
  isEnabled: boolean;
};

type RestaurantNoticeRow = {
  notice_key: string;
  message: string;
  is_enabled: boolean;
};

const DEFAULT_RESTAURANT_NOTICES: RestaurantNotice[] = [
  {
    key: "menu-photo-disclaimer",
    title: "Menu Photo Disclaimer",
    description:
      "Controls the disclaimer used with menu and food photography.",
    message:
      "Food photos are for illustrative purposes only. Actual portions, presentation, and appearance may vary.",
    isEnabled: true,
  },

  {
    key: "same-day-order-notice",
    title: "Same-Day Order Notice",
    description:
      "Warns customers not to use website forms for orders needed the same day.",
    message:
      "Please do not use this form for an order needed today. Call the restaurant directly for same-day assistance.",
    isEnabled: true,
  },

  {
    key: "online-ordering-notice",
    title: "Online Ordering Notice",
    description:
      "Explains that online ordering is not currently available.",
    message:
      "Online ordering is coming soon. Please call Ronnie's Q directly to place orders for now.",
    isEnabled: true,
  },
];

export const getRestaurantNotices = cache(
  async (): Promise<RestaurantNotice[]> => {
    const supabase =
      getPublicSupabaseClient();

    if (!supabase) {
      return DEFAULT_RESTAURANT_NOTICES;
    }

    const { data, error } = await supabase
      .from("restaurant_notices")
      .select(
        "notice_key, message, is_enabled",
      );

    if (error) {
      console.error(
        "Unable to load restaurant notices:",
        error,
      );

      return DEFAULT_RESTAURANT_NOTICES;
    }

    const rows =
      (data ?? []) as RestaurantNoticeRow[];

    const rowsByKey = new Map(
      rows.map((row) => [
        row.notice_key,
        row,
      ]),
    );

    return DEFAULT_RESTAURANT_NOTICES.map(
      (fallbackNotice) => {
        const row =
          rowsByKey.get(
            fallbackNotice.key,
          );

        if (!row) {
          return fallbackNotice;
        }

        return {
          ...fallbackNotice,
          message:
            row.message ||
            fallbackNotice.message,
          isEnabled:
            row.is_enabled,
        };
      },
    );
  },
);