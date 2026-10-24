import { cache } from "react";

import {
    MEDIA_BUCKET,
} from "@/lib/media-constants";

import {
    getPublicSupabaseClient,
} from "@/lib/supabase-public";

export type HomepageArticleCard = {
    cardNumber: number;
    source: string;
    datetime: string;
    title: string;
    imagePath: string;
    imageAlt: string;
    url: string;
};

export type HomepageArticlesContent = {
    subtitle: string;
    title: string;
    articleLabel: string;
    buttonText: string;
    cards: HomepageArticleCard[];
};

type HomepageArticlesSectionRow = {
    subtitle: string;
    title: string;
    article_label: string;
    button_text: string;
};

type HomepageArticleCardRow = {
    card_number: number;
    source: string;
    article_date: string;
    title: string;
    image_path: string;
    url: string;
};

type MediaAltRow = {
    storage_path: string;
    alt_text: string;
};

const DEFAULT_ARTICLE_CARDS:
    HomepageArticleCard[] = [
        {
            cardNumber: 1,

            source:
                "WKRN",

            datetime:
                "2020-05-01",

            title:
                "Restaurants start to see effects of meat shortage during COVID-19 pandemic",

            imagePath:
                "/images/article-wkrn.webp",

            imageAlt:
                "Restaurants start to see effects of meat shortage during COVID-19 pandemic",

            url:
                "https://www.wkrn.com/community/health/coronavirus/restaurants-start-to-see-effects-of-meat-shortage-during-covid-19-pandemic/",
        },
        {
            cardNumber: 2,

            source:
                "Livability",

            datetime:
                "2014-11-08",

            title:
                "Local Dining Scene in Dickson, TN",

            imagePath:
                "/images/article-livability.jpg",

            imageAlt:
                "Local Dining Scene in Dickson, TN",

            url:
                "https://livability.com/tn/dickson/experiences-adventures/local-dining-scene-in-dickson-tn/",
        },
        {
            cardNumber: 3,

            source:
                "Dickson Post",

            datetime:
                "2026-05-01",

            title:
                "Ronnie Primm goes whole hog on customer service",

            imagePath:
                "/images/article-dickson-post1.png",

            imageAlt:
                "Ronnie Primm goes whole hog on customer service",

            url:
                "https://mainstreetmediatn.com/articles/dicksonpost/ronnie-primm-goes-whole-hog-on-customer-service/",
        },
    ];

export const DEFAULT_HOMEPAGE_ARTICLES:
    HomepageArticlesContent = {
        subtitle:
            "In The News",

        title:
            "Ronnie's Q Articles",

        articleLabel:
            "Read Article",

        buttonText:
            "Contact Us",

        cards:
            DEFAULT_ARTICLE_CARDS,
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

export const getHomepageArticlesContent =
    cache(
        async (): Promise<HomepageArticlesContent> => {
            const supabase =
                getPublicSupabaseClient();

            if (!supabase) {
                return DEFAULT_HOMEPAGE_ARTICLES;
            }

            const supabaseClient =
                supabase;

            const [
                sectionResult,
                cardsResult,
            ] = await Promise.all([
                supabaseClient
                    .from(
                        "homepage_articles_section",
                    )
                    .select(
                        `
                            subtitle,
                            title,
                            article_label,
                            button_text
                        `,
                    )
                    .eq("id", 1)
                    .maybeSingle(),

                supabaseClient
                    .from(
                        "homepage_article_cards",
                    )
                    .select(
                        `
                            card_number,
                            source,
                            article_date,
                            title,
                            image_path,
                            url
                        `,
                    )
                    .order(
                        "card_number",
                        {
                            ascending: true,
                        },
                    ),
            ]);

            if (
                sectionResult.error
            ) {
                console.error(
                    "Unable to load Homepage Articles section:",
                    sectionResult.error,
                );
            }

            if (
                cardsResult.error
            ) {
                console.error(
                    "Unable to load Homepage Article cards:",
                    cardsResult.error,
                );
            }

            const section =
                sectionResult.data as
                    | HomepageArticlesSectionRow
                    | null;

            const databaseCards =
                (
                    cardsResult.data ??
                    []
                ) as HomepageArticleCardRow[];

            const mergedCards =
                DEFAULT_ARTICLE_CARDS.map(
                    (fallbackCard) => {
                        const databaseCard =
                            databaseCards.find(
                                (card) =>
                                    card.card_number ===
                                    fallbackCard.cardNumber,
                            );

                        if (!databaseCard) {
                            return {
                                ...fallbackCard,
                            };
                        }

                        return {
                            cardNumber:
                                fallbackCard.cardNumber,

                            source:
                                databaseCard.source ||
                                fallbackCard.source,

                            datetime:
                                databaseCard.article_date ||
                                fallbackCard.datetime,

                            title:
                                databaseCard.title ||
                                fallbackCard.title,

                            imagePath:
                                databaseCard.image_path ||
                                fallbackCard.imagePath,

                            imageAlt:
                                fallbackCard.imageAlt,

                            url:
                                databaseCard.url ||
                                fallbackCard.url,
                        };
                    },
                );

            const storagePaths = [
                ...new Set(
                    mergedCards
                        .map(
                            (card) =>
                                card.imagePath,
                        )
                        .filter(
                            (path) =>
                                !isLocalOrFullUrl(
                                    path,
                                ),
                        ),
                ),
            ];

            let mediaRows:
                MediaAltRow[] = [];

            if (
                storagePaths.length >
                0
            ) {
                const {
                    data,
                    error,
                } =
                    await supabaseClient
                        .from(
                            "media_assets",
                        )
                        .select(
                            "storage_path, alt_text",
                        )
                        .in(
                            "storage_path",
                            storagePaths,
                        );

                if (error) {
                    console.error(
                        "Unable to load Homepage Article Media Library details:",
                        error,
                    );
                } else {
                    mediaRows =
                        (
                            data ??
                            []
                        ) as MediaAltRow[];
                }
            }

            const cards =
                mergedCards.map(
                    (card) => {
                        if (
                            isLocalOrFullUrl(
                                card.imagePath,
                            )
                        ) {
                            return card;
                        }

                        const mediaRow =
                            mediaRows.find(
                                (row) =>
                                    row.storage_path ===
                                    card.imagePath,
                            );

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
                                    card.imagePath,
                                );

                        return {
                            ...card,

                            imagePath:
                                publicUrlData.publicUrl,

                            imageAlt:
                                mediaRow?.alt_text ||
                                card.title,
                        };
                    },
                );

            return {
                subtitle:
                    section?.subtitle ||
                    DEFAULT_HOMEPAGE_ARTICLES
                        .subtitle,

                title:
                    section?.title ||
                    DEFAULT_HOMEPAGE_ARTICLES
                        .title,

                articleLabel:
                    section?.article_label ||
                    DEFAULT_HOMEPAGE_ARTICLES
                        .articleLabel,

                buttonText:
                    section?.button_text ||
                    DEFAULT_HOMEPAGE_ARTICLES
                        .buttonText,

                cards,
            };
        },
    );