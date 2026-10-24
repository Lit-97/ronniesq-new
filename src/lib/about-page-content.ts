import { cache } from "react";

import {
    MEDIA_BUCKET,
} from "@/lib/media-constants";

import {
    getPublicSupabaseClient,
} from "@/lib/supabase-public";


/*-----------------------------------*\
  #TYPES
\*-----------------------------------*/

export type AboutPageImage = {
    imagePath: string;
    imageValue: string;
    imageAlt: string;
};


export type AboutPageHistoryCard = {
    cardNumber: number;
    title: string;
    description: string;
    image: AboutPageImage;
};


export type AboutPageValueCard = {
    cardNumber: number;
    title: string;
    description: string;
};


export type AboutPageMemoryImage = {
    id: number;
    imagePath: string;
    imageValue: string;
    imageAlt: string;
    displayOrder: number;
};


export type AboutPageContent = {
    hero: {
        eyebrow: string;

        titleLine1: string;
        titleLine2: string;

        descriptionBeforeCity: string;

        meta1: string;
        meta2: string;

        menuButtonText: string;
        callButtonText: string;

        photoCaption: string;

        image: AboutPageImage;
    };

    story: {
        subtitle: string;
        title: string;

        paragraph1BeforeCity: string;
        paragraph1AfterCity: string;

        paragraph2: string;

        smokerImage: AboutPageImage;
        mainAwardImage: AboutPageImage;
        dicksonAwardImage: AboutPageImage;
    };

    history: {
        subtitle: string;
        title: string;
        intro: string;

        cards:
        AboutPageHistoryCard[];
    };

    values: {
        subtitle: string;
        title: string;

        cards:
        AboutPageValueCard[];
    };

    memories: {
        subtitle: string;
        title: string;
        intro: string;

        images:
        AboutPageMemoryImage[];
    };

    location: {
        subtitle: string;

        titlePrefix: string;

        descriptionBeforeCity:
        string;

        descriptionAfterCity:
        string;

        visitButtonText: string;
        menuButtonText: string;

        image: AboutPageImage;
    };
};


/*-----------------------------------*\
  #DATABASE ROW TYPES
\*-----------------------------------*/

type AboutPageContentRow = {
    hero_eyebrow: string;

    hero_title_line_1: string;
    hero_title_line_2: string;

    hero_description_before_city:
    string;

    hero_meta_1: string;
    hero_meta_2: string;

    hero_menu_button_text: string;
    hero_call_button_text: string;

    hero_photo_caption: string;

    hero_image_path: string;


    story_subtitle: string;
    story_title: string;

    story_paragraph_1_before_city:
    string;

    story_paragraph_1_after_city:
    string;

    story_paragraph_2: string;

    story_smoker_image_path:
    string;

    story_main_award_image_path:
    string;

    story_dickson_award_image_path:
    string;


    history_subtitle: string;
    history_title: string;
    history_intro: string;

    history_card_1_title:
    string;

    history_card_1_description:
    string;

    history_card_1_image_path:
    string;

    history_card_2_title:
    string;

    history_card_2_description:
    string;

    history_card_2_image_path:
    string;

    history_card_3_title:
    string;

    history_card_3_description:
    string;

    history_card_3_image_path:
    string;


    values_subtitle: string;
    values_title: string;

    values_card_1_title:
    string;

    values_card_1_description:
    string;

    values_card_2_title:
    string;

    values_card_2_description:
    string;

    values_card_3_title:
    string;

    values_card_3_description:
    string;


    memories_subtitle: string;
    memories_title: string;
    memories_intro: string;


    location_subtitle: string;

    location_title_prefix:
    string;

    location_description_before_city:
    string;

    location_description_after_city:
    string;

    location_visit_button_text:
    string;

    location_menu_button_text:
    string;

    location_image_path:
    string;
};


type AboutPageMemoryImageRow = {
    id: number;

    image_path: string;

    alt_text: string;

    display_order: number;
};


type MediaAssetRow = {
    storage_path: string;

    alt_text:
    string | null;
};


/*-----------------------------------*\
  #HELPERS
\*-----------------------------------*/

function isLocalOrFullUrl(
    path: string,
): boolean {
    return (
        path.startsWith("/") ||
        path.startsWith("http://") ||
        path.startsWith("https://")
    );
}


function localImage(
    imagePath: string,
    imageAlt: string,
): AboutPageImage {
    return {
        imagePath,
        imageValue:
            imagePath,
        imageAlt,
    };
}


/*-----------------------------------*\
  #DEFAULT MEMORY GALLERY
\*-----------------------------------*/

const DEFAULT_MEMORY_IMAGE_PATHS = [
    "/images/about/cookout-fred.jpg",
    "/images/about/cookout-fred2.jpg",
    "/images/about/cookout-fred3.jpg",

    "/images/about/cookout-guest.jpg",
    "/images/about/cookout-guest2.jpg",
    "/images/about/cookout-guest3.jpg",
    "/images/about/cookout-guest4.jpg",
    "/images/about/cookout-guest5.jpg",
    "/images/about/cookout-guest6.jpg",
    "/images/about/cookout-guest7.jpg",

    "/images/about/cookout-guice.jpg",

    "/images/about/cookout-hog.jpg",
    "/images/about/cookout-hog-cook-leftangle.jpg",
    "/images/about/cookout-hog-cook-rightangle.jpg",
    "/images/about/cookout-hog-frontangle.jpg",
    "/images/about/cookout-hog-open.jpg",
    "/images/about/cookout-hog-pulled.png",

    "/images/about/cookout-ronnie.jpg",
    "/images/about/cookout-ronnie2.jpg",

    "/images/about/cookout-shirley.jpg",
    "/images/about/cookout-temp.jpg",
    "/images/about/cookout-william.jpg",

    "/images/about/pool-party.jpg",
    "/images/about/pool-party-guest.jpg",
    "/images/about/pool-party-guest2.jpg",
    "/images/about/pool-party-guest3.jpg",

    "/images/about/rp-building.jpg",
    "/images/about/rp-new-building.jpg",

    "/images/about/crew.jpg",
    "/images/about/RQ.jpg",
    "/images/about/butchers.jpg",

    "/images/about/cookout-albert.jpg",
    "/images/about/cookout-brothers.jpg",
    "/images/about/cookout-cindy.jpg",
    "/images/about/cookout-cindy2.jpg",
    "/images/about/cookout-donnie.jpg",
    "/images/about/cookout-donnie-cooking.jpg",
    "/images/about/cookout-fire.jpg",

    "/images/about/catering-event-vans.jpg",
    "/images/about/catering-event.jpg",
    "/images/about/catering-event-serving.jpg",
];


export const DEFAULT_ABOUT_PAGE_MEMORY_IMAGES:
AboutPageMemoryImage[] =
    DEFAULT_MEMORY_IMAGE_PATHS.map(
        (
            imagePath,
            index,
        ) => ({
            id:
                index + 1,

            imagePath,

            imageValue:
                imagePath,

            imageAlt:
                "Ronnie's Q memory",

            displayOrder:
                index + 1,
        }),
    );


/*-----------------------------------*\
  #DEFAULT ABOUT PAGE CONTENT
\*-----------------------------------*/

export const DEFAULT_ABOUT_PAGE_CONTENT:
AboutPageContent = {
    hero: {
        eyebrow:
            "Our Story",

        titleLine1:
            "Built on Smoke.",

        titleLine2:
            "Made with Family.",

        descriptionBeforeCity:
            "Ronnie's Q brings slow-smoked barbecue, hometown service, and generations of Tennessee tradition to the heart of",

        meta1:
            "Hickory Smoked",

        meta2:
            "Family Owned",

        menuButtonText:
            "View Menu",

        callButtonText:
            "Call To Order",

        photoCaption:
            "Just Runnin' Around Grillin'",

        image:
            localImage(
                "/images/about/grillin.png",
                "Ronnie's Q grill in action",
            ),
    },


    story: {
        subtitle:
            "Ronnie's Q",

        title:
            "A Local BBQ Spot with Real Roots",

        paragraph1BeforeCity:
            "Nestled in the heart of Middle Tennessee, Ronnie's Q is a local treasure where the region's barbecue tradition has been slow-cooked to perfection for decades. Whether you're exploring Montgomery Bell State Park or passing through",

        paragraph1AfterCity:
            ", our cozy spot invites you to enjoy hickory-smoked barbecue served with Southern hospitality.",

        paragraph2:
            "From family-style meals to quick bites, dine-in or takeout, every plate tells the story of generations spent perfecting the craft. Our barbecue may be served quick, but it is made slow.",

        smokerImage:
            localImage(
                "/images/about/cookout-hog-pulled.png",
                "Ronnie's Q smoker pit with barbecue",
            ),

        mainAwardImage:
            localImage(
                "/images/about/main-street-award-plaque.png",
                "Ronnie's Q 2025 Middle Tennessee Main Street Award",
            ),

        dicksonAwardImage:
            localImage(
                "/images/about/dickson-county-award-plaque.png",
                "Ronnie's Q Dickson County Best BBQ awards",
            ),
    },


    history: {
        subtitle:
            "History",

        title:
            "From Tobacco Fields to Hickory Coals",

        intro:
            "The story behind Ronnie's Q started long before the restaurant doors opened. It began with family, hard work, and nights gathered around a fire.",

        cards: [
            {
                cardNumber:
                    1,

                title:
                    "Hard Work Came First",

                description:
                    "Ronnie's Q is proudly owned and operated by Ronnie Primm, a Tennessee native with deep roots in rural Charlotte. As a young boy, Ronnie learned the value of hard work while tending tobacco fields alongside his father and five brothers.",

                image:
                    localImage(
                        "/images/about/tobacco-farm.jpg",
                        "Vintage photo of Ronnie",
                    ),
            },

            {
                cardNumber:
                    2,

                title:
                    "The Spark Started Early",

                description:
                    "Ronnie still remembers watching his dad and uncles prep for a cookout — a process that captivated him from start to finish. A whole hog, glowing hickory coals, fence wire, concrete blocks, and an all-night fire became part of the tradition.",

                image:
                    localImage(
                        "/images/about/hog-pit.png",
                        "Traditional barbecue pit",
                    ),
            },

            {
                cardNumber:
                    3,

                title:
                    "The Ronnie's Q Way",

                description:
                    "What followed was an all-night tradition — laughter, storytelling, and the kind of tall tales that only come out around a fire. Those nights lit a spark in Ronnie, one that still burns bright today. We keep things simple: bold flavors, big portions, and no shortcuts.",

                image:
                    localImage(
                        "/images/about/rq-way.png",
                        "Family barbecue tradition at Ronnie's Q",
                    ),
            },
        ],
    },


    values: {
        subtitle:
            "What We Stand On",

        title:
            "The Flavor Comes from the Foundation",

        cards: [
            {
                cardNumber:
                    1,

                title:
                    "Slow-Smoked Flavor",

                description:
                    "The food may be served fast, but the flavor comes from smoke, patience, and tradition.",
            },

            {
                cardNumber:
                    2,

                title:
                    "Hometown Service",

                description:
                    "Ronnie's Q is built around familiar faces, friendly service, and meals worth coming back for.",
            },

            {
                cardNumber:
                    3,

                title:
                    "No Shortcuts",

                description:
                    "Big portions, bold barbecue, and classic sides made with care are at the center of every plate.",
            },
        ],
    },


    memories: {
        subtitle:
            "Memories",

        title:
            "Through the Years",

        intro:
            "A look at the people, pits, plates, and moments that helped shape Ronnie's Q.",

        images:
            DEFAULT_ABOUT_PAGE_MEMORY_IMAGES,
    },


    location: {
        subtitle:
            "Convenient Location & Hometown Service",

        titlePrefix:
            "The Best BBQ in",

        descriptionBeforeCity:
            "Located in the heart of",

        descriptionAfterCity:
            ", Ronnie's Q is a must-stop for anyone craving authentic Southern barbecue. Stop in for pulled pork, tender ribs, barbecue sandwiches, and classic Southern sides.",

        visitButtonText:
            "Visit Us",

        menuButtonText:
            "View Menu",

        image:
            localImage(
                "/images/about/full-building.png",
                "Ronnie's Q restaurant location",
            ),
    },
};


/*-----------------------------------*\
  #LOAD ABOUT PAGE CONTENT
\*-----------------------------------*/

export const getAboutPageContent =
    cache(
        async (): Promise<AboutPageContent> => {
            const supabase =
                getPublicSupabaseClient();


            if (!supabase) {
                return DEFAULT_ABOUT_PAGE_CONTENT;
            }


            const supabaseClient =
                supabase;


            const [
                contentResult,
                memoryImagesResult,
            ] =
                await Promise.all([
                    supabaseClient
                        .from(
                            "about_page_content",
                        )
                        .select(
                            `
                                hero_eyebrow,
                                hero_title_line_1,
                                hero_title_line_2,
                                hero_description_before_city,
                                hero_meta_1,
                                hero_meta_2,
                                hero_menu_button_text,
                                hero_call_button_text,
                                hero_photo_caption,
                                hero_image_path,

                                story_subtitle,
                                story_title,
                                story_paragraph_1_before_city,
                                story_paragraph_1_after_city,
                                story_paragraph_2,
                                story_smoker_image_path,
                                story_main_award_image_path,
                                story_dickson_award_image_path,

                                history_subtitle,
                                history_title,
                                history_intro,
                                history_card_1_title,
                                history_card_1_description,
                                history_card_1_image_path,
                                history_card_2_title,
                                history_card_2_description,
                                history_card_2_image_path,
                                history_card_3_title,
                                history_card_3_description,
                                history_card_3_image_path,

                                values_subtitle,
                                values_title,
                                values_card_1_title,
                                values_card_1_description,
                                values_card_2_title,
                                values_card_2_description,
                                values_card_3_title,
                                values_card_3_description,

                                memories_subtitle,
                                memories_title,
                                memories_intro,

                                location_subtitle,
                                location_title_prefix,
                                location_description_before_city,
                                location_description_after_city,
                                location_visit_button_text,
                                location_menu_button_text,
                                location_image_path
                            `,
                        )
                        .eq(
                            "id",
                            1,
                        )
                        .maybeSingle(),

                    supabaseClient
                        .from(
                            "about_page_memory_images",
                        )
                        .select(
                            `
                                id,
                                image_path,
                                alt_text,
                                display_order
                            `,
                        )
                        .order(
                            "display_order",
                            {
                                ascending:
                                    true,
                            },
                        ),
                ]);


            if (contentResult.error) {
                console.error(
                    "Unable to load About Page content:",
                    contentResult.error,
                );
            }


            if (memoryImagesResult.error) {
                console.error(
                    "Unable to load About Page memory images:",
                    memoryImagesResult.error,
                );
            }


            const row =
                contentResult.data
                    ? (
                        contentResult.data as
                        AboutPageContentRow
                    )
                    : null;


            const memoryRows =
                memoryImagesResult.error
                    ? []
                    : (
                        memoryImagesResult.data ??
                        []
                    ) as
                    AboutPageMemoryImageRow[];


            /*
             * Use the current database
             * image path when available.
             *
             * Local /images/... paths keep
             * working exactly as they do now.
             *
             * Later, Media Library storage
             * paths can be converted into
             * public Supabase URLs here.
             */
            const heroImageValue =
                row?.hero_image_path?.trim() ||
                DEFAULT_ABOUT_PAGE_CONTENT
                    .hero
                    .image
                    .imageValue;


            const storySmokerImageValue =
                row?.story_smoker_image_path?.trim() ||
                DEFAULT_ABOUT_PAGE_CONTENT
                    .story
                    .smokerImage
                    .imageValue;


            const storyMainAwardImageValue =
                row?.story_main_award_image_path?.trim() ||
                DEFAULT_ABOUT_PAGE_CONTENT
                    .story
                    .mainAwardImage
                    .imageValue;


            const storyDicksonAwardImageValue =
                row?.story_dickson_award_image_path?.trim() ||
                DEFAULT_ABOUT_PAGE_CONTENT
                    .story
                    .dicksonAwardImage
                    .imageValue;


            const historyCard1ImageValue =
                row?.history_card_1_image_path?.trim() ||
                DEFAULT_ABOUT_PAGE_CONTENT
                    .history
                    .cards[0]
                    .image
                    .imageValue;


            const historyCard2ImageValue =
                row?.history_card_2_image_path?.trim() ||
                DEFAULT_ABOUT_PAGE_CONTENT
                    .history
                    .cards[1]
                    .image
                    .imageValue;


            const historyCard3ImageValue =
                row?.history_card_3_image_path?.trim() ||
                DEFAULT_ABOUT_PAGE_CONTENT
                    .history
                    .cards[2]
                    .image
                    .imageValue;


            const locationImageValue =
                row?.location_image_path?.trim() ||
                DEFAULT_ABOUT_PAGE_CONTENT
                    .location
                    .image
                    .imageValue;


            const memorySourceRows =
                memoryRows.length > 0
                    ? memoryRows
                    : DEFAULT_ABOUT_PAGE_MEMORY_IMAGES
                        .map(
                            (
                                image,
                            ) => ({
                                id:
                                    image.id,

                                image_path:
                                    image.imageValue,

                                alt_text:
                                    image.imageAlt,

                                display_order:
                                    image.displayOrder,
                            }),
                        );


            /*
             * Gather every Supabase Storage
             * path so we can load alt text
             * in one Media Library query.
             */
            const allImageValues = [
                heroImageValue,

                storySmokerImageValue,
                storyMainAwardImageValue,
                storyDicksonAwardImageValue,

                historyCard1ImageValue,
                historyCard2ImageValue,
                historyCard3ImageValue,

                locationImageValue,

                ...memorySourceRows.map(
                    (image) =>
                        image.image_path,
                ),
            ];


            const storagePaths = [
                ...new Set(
                    allImageValues.filter(
                        (path) =>
                            path &&
                            !isLocalOrFullUrl(
                                path,
                            ),
                    ),
                ),
            ];


            const mediaAltByPath =
                new Map<
                    string,
                    string
                >();


            if (
                storagePaths.length >
                0
            ) {
                const {
                    data:
                    mediaAssets,

                    error:
                    mediaAssetsError,
                } =
                    await supabaseClient
                        .from(
                            "media_assets",
                        )
                        .select(
                            `
                                storage_path,
                                alt_text
                            `,
                        )
                        .in(
                            "storage_path",
                            storagePaths,
                        );


                if (mediaAssetsError) {
                    console.error(
                        "Unable to load About Page Media Library details:",
                        mediaAssetsError,
                    );
                } else {
                    (
                        mediaAssets ??
                        []
                    ).forEach(
                        (
                            asset,
                        ) => {
                            const typedAsset =
                                asset as
                                MediaAssetRow;


                            if (
                                typedAsset
                                    .alt_text
                                    ?.trim()
                            ) {
                                mediaAltByPath.set(
                                    typedAsset
                                        .storage_path,

                                    typedAsset
                                        .alt_text
                                        .trim(),
                                );
                            }
                        },
                    );
                }
            }


            function resolveImage(
                imageValue: string,
                fallbackAlt: string,
            ): AboutPageImage {
                if (
                    isLocalOrFullUrl(
                        imageValue,
                    )
                ) {
                    return {
                        imagePath:
                            imageValue,

                        imageValue,

                        imageAlt:
                            fallbackAlt,
                    };
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
                            imageValue,
                        );


                return {
                    imagePath:
                        publicUrlData
                            .publicUrl,

                    imageValue,

                    imageAlt:
                        mediaAltByPath.get(
                            imageValue,
                        ) ||
                        fallbackAlt,
                };
            }


            const resolvedMemoryImages =
                memorySourceRows.map(
                    (
                        image,
                    ) => {
                        const resolved =
                            resolveImage(
                                image.image_path,

                                image.alt_text ||
                                "Ronnie's Q memory",
                            );


                        return {
                            id:
                                Number(
                                    image.id,
                                ),

                            imagePath:
                                resolved
                                    .imagePath,

                            imageValue:
                                resolved
                                    .imageValue,

                            imageAlt:
                                resolved
                                    .imageAlt,

                            displayOrder:
                                image.display_order,
                        };
                    },
                );


            return {
                hero: {
                    eyebrow:
                        row?.hero_eyebrow ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .hero
                            .eyebrow,

                    titleLine1:
                        row?.hero_title_line_1 ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .hero
                            .titleLine1,

                    titleLine2:
                        row?.hero_title_line_2 ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .hero
                            .titleLine2,

                    descriptionBeforeCity:
                        row?.hero_description_before_city ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .hero
                            .descriptionBeforeCity,

                    meta1:
                        row?.hero_meta_1 ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .hero
                            .meta1,

                    meta2:
                        row?.hero_meta_2 ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .hero
                            .meta2,

                    menuButtonText:
                        row?.hero_menu_button_text ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .hero
                            .menuButtonText,

                    callButtonText:
                        row?.hero_call_button_text ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .hero
                            .callButtonText,

                    photoCaption:
                        row?.hero_photo_caption ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .hero
                            .photoCaption,

                    image:
                        resolveImage(
                            heroImageValue,
                            DEFAULT_ABOUT_PAGE_CONTENT
                                .hero
                                .image
                                .imageAlt,
                        ),
                },


                story: {
                    subtitle:
                        row?.story_subtitle ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .story
                            .subtitle,

                    title:
                        row?.story_title ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .story
                            .title,

                    paragraph1BeforeCity:
                        row?.story_paragraph_1_before_city ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .story
                            .paragraph1BeforeCity,

                    paragraph1AfterCity:
                        row?.story_paragraph_1_after_city ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .story
                            .paragraph1AfterCity,

                    paragraph2:
                        row?.story_paragraph_2 ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .story
                            .paragraph2,

                    smokerImage:
                        resolveImage(
                            storySmokerImageValue,
                            DEFAULT_ABOUT_PAGE_CONTENT
                                .story
                                .smokerImage
                                .imageAlt,
                        ),

                    mainAwardImage:
                        resolveImage(
                            storyMainAwardImageValue,
                            DEFAULT_ABOUT_PAGE_CONTENT
                                .story
                                .mainAwardImage
                                .imageAlt,
                        ),

                    dicksonAwardImage:
                        resolveImage(
                            storyDicksonAwardImageValue,
                            DEFAULT_ABOUT_PAGE_CONTENT
                                .story
                                .dicksonAwardImage
                                .imageAlt,
                        ),
                },


                history: {
                    subtitle:
                        row?.history_subtitle ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .history
                            .subtitle,

                    title:
                        row?.history_title ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .history
                            .title,

                    intro:
                        row?.history_intro ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .history
                            .intro,

                    cards: [
                        {
                            cardNumber:
                                1,

                            title:
                                row?.history_card_1_title ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .history
                                    .cards[0]
                                    .title,

                            description:
                                row?.history_card_1_description ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .history
                                    .cards[0]
                                    .description,

                            image:
                                resolveImage(
                                    historyCard1ImageValue,
                                    DEFAULT_ABOUT_PAGE_CONTENT
                                        .history
                                        .cards[0]
                                        .image
                                        .imageAlt,
                                ),
                        },

                        {
                            cardNumber:
                                2,

                            title:
                                row?.history_card_2_title ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .history
                                    .cards[1]
                                    .title,

                            description:
                                row?.history_card_2_description ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .history
                                    .cards[1]
                                    .description,

                            image:
                                resolveImage(
                                    historyCard2ImageValue,
                                    DEFAULT_ABOUT_PAGE_CONTENT
                                        .history
                                        .cards[1]
                                        .image
                                        .imageAlt,
                                ),
                        },

                        {
                            cardNumber:
                                3,

                            title:
                                row?.history_card_3_title ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .history
                                    .cards[2]
                                    .title,

                            description:
                                row?.history_card_3_description ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .history
                                    .cards[2]
                                    .description,

                            image:
                                resolveImage(
                                    historyCard3ImageValue,
                                    DEFAULT_ABOUT_PAGE_CONTENT
                                        .history
                                        .cards[2]
                                        .image
                                        .imageAlt,
                                ),
                        },
                    ],
                },


                values: {
                    subtitle:
                        row?.values_subtitle ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .values
                            .subtitle,

                    title:
                        row?.values_title ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .values
                            .title,

                    cards: [
                        {
                            cardNumber:
                                1,

                            title:
                                row?.values_card_1_title ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .values
                                    .cards[0]
                                    .title,

                            description:
                                row?.values_card_1_description ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .values
                                    .cards[0]
                                    .description,
                        },

                        {
                            cardNumber:
                                2,

                            title:
                                row?.values_card_2_title ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .values
                                    .cards[1]
                                    .title,

                            description:
                                row?.values_card_2_description ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .values
                                    .cards[1]
                                    .description,
                        },

                        {
                            cardNumber:
                                3,

                            title:
                                row?.values_card_3_title ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .values
                                    .cards[2]
                                    .title,

                            description:
                                row?.values_card_3_description ||
                                DEFAULT_ABOUT_PAGE_CONTENT
                                    .values
                                    .cards[2]
                                    .description,
                        },
                    ],
                },


                memories: {
                    subtitle:
                        row?.memories_subtitle ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .memories
                            .subtitle,

                    title:
                        row?.memories_title ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .memories
                            .title,

                    intro:
                        row?.memories_intro ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .memories
                            .intro,

                    images:
                        resolvedMemoryImages,
                },


                location: {
                    subtitle:
                        row?.location_subtitle ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .location
                            .subtitle,

                    titlePrefix:
                        row?.location_title_prefix ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .location
                            .titlePrefix,

                    descriptionBeforeCity:
                        row?.location_description_before_city ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .location
                            .descriptionBeforeCity,

                    descriptionAfterCity:
                        row?.location_description_after_city ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .location
                            .descriptionAfterCity,

                    visitButtonText:
                        row?.location_visit_button_text ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .location
                            .visitButtonText,

                    menuButtonText:
                        row?.location_menu_button_text ||
                        DEFAULT_ABOUT_PAGE_CONTENT
                            .location
                            .menuButtonText,

                    image:
                        resolveImage(
                            locationImageValue,
                            DEFAULT_ABOUT_PAGE_CONTENT
                                .location
                                .image
                                .imageAlt,
                        ),
                },
            };
        },
    );