import { cache } from "react";

import {
    getPublicSupabaseClient,
} from "@/lib/supabase-public";

import {
    MEDIA_BUCKET,
} from "@/lib/media-constants";

export type HomepageHeroSlide = {
    slideNumber: number;
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    buttonText: string;
    imagePath: string;
};

type HomepageHeroSlideRow = {
    slide_number: number;
    subtitle: string;
    title_line_1: string;
    title_line_2: string;
    description: string;
    button_text: string;
    image_path: string | null;
};

export const DEFAULT_HOMEPAGE_HERO_SLIDES: HomepageHeroSlide[] = [
    {
        slideNumber: 1,
        subtitle: "Home of the Big Sandwich",
        titleLine1: "Big portions",
        titleLine2: "bold BBQ taste",
        description:
            "From sandwiches to plates, Ronnie's serves hearty favorites made to satisfy.",
        buttonText: "Explore Favorites",
        imagePath: "/images/hero-slider-2.png",
    },
    {
        slideNumber: 2,
        subtitle: "Smokehouse Flavor",
        titleLine1: "Southern comfort",
        titleLine2: "made fresh daily",
        description:
            "Come hungry and enjoy barbecue, comfort food, and family-style favorites.",
        buttonText: "View Our Menu",
        imagePath: "/images/hero-slider-1.png",
    },
    {
        slideNumber: 3,
        subtitle: "Catering & Family Meals",
        titleLine1: "Bring Ronnie's",
        titleLine2: "to your gathering",
        description:
            "Serving events, family gatherings, work lunches, and celebrations with BBQ favorites.",
        buttonText: "Ask About Catering",
        imagePath: "/images/hero-slider-3.png",
    },
];

function resolveHeroImagePath(
    imagePath: string,
    supabase: NonNullable<
        ReturnType<typeof getPublicSupabaseClient>
    >,
): string {
    /*
     * Images beginning with "/" are still local
     * images inside the Next.js /public folder.
     */
    if (imagePath.startsWith("/")) {
        return imagePath;
    }

    /*
     * If a complete URL was ever saved, leave it
     * alone rather than trying to treat it as a
     * Supabase Storage path.
     */
    if (
        imagePath.startsWith("https://") ||
        imagePath.startsWith("http://")
    ) {
        return imagePath;
    }

    /*
     * Everything else is treated as a Media Library
     * storage path such as:
     *
     * homepage/123456-example.webp
     */
    const {
        data: publicUrlData,
    } = supabase.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(imagePath);

    return publicUrlData.publicUrl;
}

export const getHomepageHeroSlides = cache(
    async (): Promise<HomepageHeroSlide[]> => {
        const supabase =
            getPublicSupabaseClient();

        if (!supabase) {
            return DEFAULT_HOMEPAGE_HERO_SLIDES;
        }

        const { data, error } = await supabase
            .from("homepage_hero_slides")
            .select(
                `
                    slide_number,
                    subtitle,
                    title_line_1,
                    title_line_2,
                    description,
                    button_text,
                    image_path
                `,
            )
            .order("slide_number", {
                ascending: true,
            });

        if (error) {
            console.error(
                "Unable to load homepage hero slides:",
                error,
            );

            return DEFAULT_HOMEPAGE_HERO_SLIDES;
        }

        const rows =
            (data ?? []) as HomepageHeroSlideRow[];

        const rowsByNumber =
            new Map(
                rows.map((row) => [
                    row.slide_number,
                    row,
                ]),
            );

        return DEFAULT_HOMEPAGE_HERO_SLIDES.map(
            (fallbackSlide) => {
                const row =
                    rowsByNumber.get(
                        fallbackSlide.slideNumber,
                    );

                if (!row) {
                    return fallbackSlide;
                }

                const storedImagePath =
                    row.image_path?.trim() ||
                    fallbackSlide.imagePath;

                return {
                    slideNumber:
                        row.slide_number,

                    subtitle:
                        row.subtitle ||
                        fallbackSlide.subtitle,

                    titleLine1:
                        row.title_line_1 ||
                        fallbackSlide.titleLine1,

                    titleLine2:
                        row.title_line_2 ||
                        fallbackSlide.titleLine2,

                    description:
                        row.description ||
                        fallbackSlide.description,

                    buttonText:
                        row.button_text ||
                        fallbackSlide.buttonText,

                    imagePath:
                        resolveHeroImagePath(
                            storedImagePath,
                            supabase,
                        ),
                };
            },
        );
    },
);