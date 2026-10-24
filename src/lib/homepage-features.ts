import { cache } from "react";

import {
    MEDIA_BUCKET,
} from "@/lib/media-constants";

import {
    getPublicSupabaseClient,
} from "@/lib/supabase-public";

export type HomepageFeatureCard = {
    cardNumber: number;
    title: string;
    description: string;
    iconPath: string;
};

export type HomepageFeaturesContent = {
    subtitle: string;
    title: string;
    cards: HomepageFeatureCard[];
};

type HomepageFeaturesSectionRow = {
    subtitle: string;
    title: string;
};

type HomepageFeatureCardRow = {
    card_number: number;
    title: string;
    description: string;
    icon_path: string;
};

const DEFAULT_FEATURE_CARDS:
    HomepageFeatureCard[] = [
        {
            cardNumber: 1,
            title: "Fresh Food",
            description:
                "Made with care and served with the kind of flavor customers remember.",
            iconPath:
                "/images/features-icon-1.png",
        },
        {
            cardNumber: 2,
            title: "Family Service",
            description:
                "A welcoming experience built around local customers and community.",
            iconPath:
                "/images/features-icon-2.png",
        },
        {
            cardNumber: 3,
            title: "Big Flavor",
            description:
                "Comfort food, barbecue favorites, and satisfying plates made fresh.",
            iconPath:
                "/images/features-icon-3.png",
        },
        {
            cardNumber: 4,
            title: "Catering Ready",
            description:
                "Catering is available now, with online ordering options being prepared.",
            iconPath:
                "/images/features-icon-4.png",
        },
    ];

export const DEFAULT_HOMEPAGE_FEATURES:
    HomepageFeaturesContent = {
        subtitle:
            "Why Choose Us",

        title:
            "Our Strength",

        cards:
            DEFAULT_FEATURE_CARDS,
    };

function resolveImagePath(
    supabase: NonNullable<
        ReturnType<
            typeof getPublicSupabaseClient
        >
    >,
    path: string,
): string {
    if (
        path.startsWith("/") ||
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    const {
        data,
    } = supabase.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(path);

    return data.publicUrl;
}

export const getHomepageFeaturesContent =
    cache(
        async (): Promise<HomepageFeaturesContent> => {
            const supabase =
                getPublicSupabaseClient();

            if (!supabase) {
                return DEFAULT_HOMEPAGE_FEATURES;
            }

            const [
                sectionResult,
                cardsResult,
            ] = await Promise.all([
                supabase
                    .from(
                        "homepage_features_section",
                    )
                    .select(
                        "subtitle, title",
                    )
                    .eq("id", 1)
                    .maybeSingle(),

                supabase
                    .from(
                        "homepage_feature_cards",
                    )
                    .select(
                        `
                            card_number,
                            title,
                            description,
                            icon_path
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
                    "Unable to load Homepage Features section:",
                    sectionResult.error,
                );
            }

            if (
                cardsResult.error
            ) {
                console.error(
                    "Unable to load Homepage Feature cards:",
                    cardsResult.error,
                );
            }

            const section =
                sectionResult.data as
                    | HomepageFeaturesSectionRow
                    | null;

            const databaseCards =
                (
                    cardsResult.data ??
                    []
                ) as HomepageFeatureCardRow[];

            const cards =
                DEFAULT_FEATURE_CARDS.map(
                    (fallbackCard) => {
                        const databaseCard =
                            databaseCards.find(
                                (card) =>
                                    card.card_number ===
                                    fallbackCard.cardNumber,
                            );

                        if (!databaseCard) {
                            return fallbackCard;
                        }

                        return {
                            cardNumber:
                                fallbackCard.cardNumber,

                            title:
                                databaseCard.title ||
                                fallbackCard.title,

                            description:
                                databaseCard.description ||
                                fallbackCard.description,

                            iconPath:
                                resolveImagePath(
                                    supabase,
                                    databaseCard.icon_path ||
                                        fallbackCard.iconPath,
                                ),
                        };
                    },
                );

            return {
                subtitle:
                    section?.subtitle ||
                    DEFAULT_HOMEPAGE_FEATURES
                        .subtitle,

                title:
                    section?.title ||
                    DEFAULT_HOMEPAGE_FEATURES
                        .title,

                cards,
            };
        },
    );