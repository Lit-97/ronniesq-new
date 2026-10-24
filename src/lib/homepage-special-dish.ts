import { cache } from "react";

import {
    MEDIA_BUCKET,
} from "@/lib/media-constants";

import {
    getPublicSupabaseClient,
} from "@/lib/supabase-public";

export type HomepageSpecialDishContent = {
    subtitle: string;

    titleLine1: string;
    titleLine2: string;
    titleLine3: string;

    description: string;
    price: string;
    buttonText: string;

    imagePath: string;
    imageAlt: string;
};

type HomepageSpecialDishRow = {
    subtitle: string;

    title_line_1: string;
    title_line_2: string;
    title_line_3: string;

    description: string;
    price: string;
    button_text: string;

    image_path: string | null;
};

type MediaAltRow = {
    storage_path: string;
    alt_text: string;
};

export const DEFAULT_HOMEPAGE_SPECIAL_DISH:
    HomepageSpecialDishContent = {
        subtitle:
            "Featured Favorite",

        titleLine1:
            "Pork Nachos",

        titleLine2:
            "with",

        titleLine3:
            "French Fries",

        description:
            "Crinkle-cut fries piled high with pulled pork, Ronnie's Q signature BBQ sauce, melted nacho cheese, and jalapeños for a bold, hearty favorite.",

        price:
            "$11.50",

        buttonText:
            "View Full Menu",

        imagePath:
            "/images/special-dish-banner.png",

        imageAlt:
            "Ronnie's Q Pork Nachos with French Fries",
    };

function isLocalOrFullUrl(
    path: string,
): boolean {
    return (
        path.startsWith("/") ||
        path.startsWith("http://") ||
        path.startsWith("https://")
    );
}

export const getHomepageSpecialDishContent =
    cache(
        async (): Promise<HomepageSpecialDishContent> => {
            const supabase =
                getPublicSupabaseClient();

            if (!supabase) {
                return DEFAULT_HOMEPAGE_SPECIAL_DISH;
            }

            const supabaseClient =
                supabase;

            const {
                data,
                error,
            } = await supabaseClient
                .from(
                    "homepage_special_dish",
                )
                .select(
                    `
                        subtitle,
                        title_line_1,
                        title_line_2,
                        title_line_3,
                        description,
                        price,
                        button_text,
                        image_path
                    `,
                )
                .eq("id", 1)
                .maybeSingle();

            if (
                error ||
                !data
            ) {
                if (error) {
                    console.error(
                        "Unable to load Homepage Special Dish:",
                        error,
                    );
                }

                return DEFAULT_HOMEPAGE_SPECIAL_DISH;
            }

            const row =
                data as HomepageSpecialDishRow;

            const imageStoragePath =
                row.image_path?.trim() ||
                DEFAULT_HOMEPAGE_SPECIAL_DISH
                    .imagePath;

            let imagePath =
                imageStoragePath;

            let imageAlt =
                DEFAULT_HOMEPAGE_SPECIAL_DISH
                    .imageAlt;

            if (
                !isLocalOrFullUrl(
                    imageStoragePath,
                )
            ) {
                const {
                    data: mediaRow,
                    error: mediaError,
                } = await supabaseClient
                    .from("media_assets")
                    .select(
                        "storage_path, alt_text",
                    )
                    .eq(
                        "storage_path",
                        imageStoragePath,
                    )
                    .maybeSingle();

                if (mediaError) {
                    console.error(
                        "Unable to load Special Dish image alt text:",
                        mediaError,
                    );
                } else if (mediaRow) {
                    imageAlt =
                        (
                            mediaRow as
                            MediaAltRow
                        ).alt_text ||
                        imageAlt;
                }

                const {
                    data:
                        publicUrlData,
                } =
                    supabaseClient.storage
                        .from(
                            MEDIA_BUCKET,
                        )
                        .getPublicUrl(
                            imageStoragePath,
                        );

                imagePath =
                    publicUrlData.publicUrl;
            }

            return {
                subtitle:
                    row.subtitle ||
                    DEFAULT_HOMEPAGE_SPECIAL_DISH
                        .subtitle,

                titleLine1:
                    row.title_line_1 ||
                    DEFAULT_HOMEPAGE_SPECIAL_DISH
                        .titleLine1,

                titleLine2:
                    row.title_line_2 ||
                    DEFAULT_HOMEPAGE_SPECIAL_DISH
                        .titleLine2,

                titleLine3:
                    row.title_line_3 ||
                    DEFAULT_HOMEPAGE_SPECIAL_DISH
                        .titleLine3,

                description:
                    row.description ||
                    DEFAULT_HOMEPAGE_SPECIAL_DISH
                        .description,

                price:
                    row.price ||
                    DEFAULT_HOMEPAGE_SPECIAL_DISH
                        .price,

                buttonText:
                    row.button_text ||
                    DEFAULT_HOMEPAGE_SPECIAL_DISH
                        .buttonText,

                imagePath,

                imageAlt,
            };
        },
    );