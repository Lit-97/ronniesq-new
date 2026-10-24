import { cache } from "react";

import {
    reviews,
} from "@/data/reviews";

import {
    MEDIA_BUCKET,
} from "@/lib/media-constants";

import {
    getPublicSupabaseClient,
} from "@/lib/supabase-public";

export type HomepageTestimonialReview = {
    reviewNumber: number;
    name: string;
    text: string;
    rating: number;
};

export type HomepageTestimonialsContent = {
    subtitle: string;
    title: string;
    intro: string;
    backgroundImagePath: string;
    backgroundImageAlt: string;
    reviews: HomepageTestimonialReview[];
};

type HomepageTestimonialsSectionRow = {
    subtitle: string;
    title: string;
    intro: string;
    background_image_path: string;
};

type HomepageTestimonialReviewRow = {
    review_number: number;
    reviewer_name: string;
    review_text: string;
    rating: number;
};

type MediaAltRow = {
    storage_path: string;
    alt_text: string;
};

const DEFAULT_REVIEWS:
    HomepageTestimonialReview[] =
    reviews.map(
        (review, index) => ({
            reviewNumber:
                index + 1,

            name:
                review.name,

            text:
                review.text,

            rating:
                5,
        }),
    );

export const DEFAULT_HOMEPAGE_TESTIMONIALS:
    HomepageTestimonialsContent = {
        subtitle:
            "Customer Reviews",

        title:
            "What People Are Saying",

        intro:
            "A few kind words from customers who have enjoyed Ronnie's Q.",

        backgroundImagePath:
            "/images/testimonial-bg.png",

        backgroundImageAlt:
            "",

        reviews:
            DEFAULT_REVIEWS,
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

export const getHomepageTestimonialsContent =
    cache(
        async (): Promise<HomepageTestimonialsContent> => {
            const supabase =
                getPublicSupabaseClient();

            if (!supabase) {
                return DEFAULT_HOMEPAGE_TESTIMONIALS;
            }

            const supabaseClient =
                supabase;

            const [
                sectionResult,
                reviewsResult,
            ] = await Promise.all([
                supabaseClient
                    .from(
                        "homepage_testimonials_section",
                    )
                    .select(
                        `
                            subtitle,
                            title,
                            intro,
                            background_image_path
                        `,
                    )
                    .eq("id", 1)
                    .maybeSingle(),

                supabaseClient
                    .from(
                        "homepage_testimonial_reviews",
                    )
                    .select(
                        `
                            review_number,
                            reviewer_name,
                            review_text,
                            rating
                        `,
                    )
                    .order(
                        "review_number",
                        {
                            ascending: true,
                        },
                    ),
            ]);

            if (
                sectionResult.error
            ) {
                console.error(
                    "Unable to load Homepage Testimonials section:",
                    sectionResult.error,
                );
            }

            if (
                reviewsResult.error
            ) {
                console.error(
                    "Unable to load Homepage testimonial reviews:",
                    reviewsResult.error,
                );
            }

            const sectionRow =
                sectionResult.data as
                    | HomepageTestimonialsSectionRow
                    | null;

            const databaseReviews =
                (
                    reviewsResult.data ??
                    []
                ) as HomepageTestimonialReviewRow[];

            const mergedReviews =
                DEFAULT_REVIEWS.map(
                    (fallbackReview) => {
                        const savedReview =
                            databaseReviews.find(
                                (review) =>
                                    review.review_number ===
                                    fallbackReview.reviewNumber,
                            );

                        if (!savedReview) {
                            return {
                                ...fallbackReview,
                            };
                        }

                        return {
                            reviewNumber:
                                fallbackReview.reviewNumber,

                            name:
                                savedReview.reviewer_name ||
                                fallbackReview.name,

                            text:
                                savedReview.review_text ||
                                fallbackReview.text,

                            rating:
                                savedReview.rating ||
                                fallbackReview.rating,
                        };
                    },
                );

            const backgroundStoragePath =
                sectionRow
                    ?.background_image_path ||
                DEFAULT_HOMEPAGE_TESTIMONIALS
                    .backgroundImagePath;

            let backgroundImagePath =
                backgroundStoragePath;

            let backgroundImageAlt =
                DEFAULT_HOMEPAGE_TESTIMONIALS
                    .backgroundImageAlt;

            if (
                !isLocalOrFullUrl(
                    backgroundStoragePath,
                )
            ) {
                const {
                    data: mediaRow,
                    error: mediaError,
                } = await supabaseClient
                    .from(
                        "media_assets",
                    )
                    .select(
                        "storage_path, alt_text",
                    )
                    .eq(
                        "storage_path",
                        backgroundStoragePath,
                    )
                    .maybeSingle();

                if (mediaError) {
                    console.error(
                        "Unable to load Testimonials background image details:",
                        mediaError,
                    );
                } else if (mediaRow) {
                    backgroundImageAlt =
                        (
                            mediaRow as
                            MediaAltRow
                        ).alt_text || "";
                }

                const {
                    data:
                        publicUrlData,
                } =
                    supabaseClient
                        .storage
                        .from(
                            MEDIA_BUCKET,
                        )
                        .getPublicUrl(
                            backgroundStoragePath,
                        );

                backgroundImagePath =
                    publicUrlData.publicUrl;
            }

            return {
                subtitle:
                    sectionRow?.subtitle ||
                    DEFAULT_HOMEPAGE_TESTIMONIALS
                        .subtitle,

                title:
                    sectionRow?.title ||
                    DEFAULT_HOMEPAGE_TESTIMONIALS
                        .title,

                intro:
                    sectionRow?.intro ||
                    DEFAULT_HOMEPAGE_TESTIMONIALS
                        .intro,

                backgroundImagePath,
                backgroundImageAlt,

                reviews:
                    mergedReviews,
            };
        },
    );