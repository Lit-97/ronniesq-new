import { cache } from "react";

import {
    MEDIA_BUCKET,
} from "@/lib/media-constants";

import {
    getPublicSupabaseClient,
} from "@/lib/supabase-public";


export type MenuPageItemContent = {
    itemId: string;
    imagePath: string;
    imageValue: string;
    imageAlt: string;
    description: string;
};


export type MenuPageCategoryContent = {
    categoryId: string;
    imagePath: string;
    imageValue: string;
    imageAlt: string;
    heading: string;
    description: string;
    buttonText: string;
};


export type MenuPageCategoryText = {
    categoryId: string;
    subtitle: string;
};


export type MenuPageSettings = {
    eyebrow: string;
    pageTitle: string;
    introText: string;
    callButtonText: string;
    contactButtonText: string;

    priceAvailabilityDisclaimer:
        string;

    calorieDisclaimer:
        string;

    photoDisclaimer:
        string;

    callInTotalDisclaimer:
        string;
};


export type MenuPageContent = {
    items:
        MenuPageItemContent[];

    categories:
        MenuPageCategoryContent[];

    categoryText:
        MenuPageCategoryText[];

    settings:
        MenuPageSettings;
};


type MenuPageItemContentRow = {
    item_id: string;
    description: string;
    image_path: string;
};


type MenuPageCategoryContentRow = {
    category_id: string;
    image_path: string;
    heading: string;
    description: string;
    button_text: string;
};


type MenuPageCategoryTextRow = {
    category_id: string;
    subtitle: string;
};


type MenuPageSettingsRow = {
    eyebrow: string;
    page_title: string;
    intro_text: string;
    call_button_text: string;
    contact_button_text: string;

    price_availability_disclaimer:
        string;

    calorie_disclaimer:
        string;

    photo_disclaimer:
        string;

    call_in_total_disclaimer:
        string;
};


type MediaAssetRow = {
    storage_path: string;
    alt_text: string | null;
};


export const DEFAULT_MENU_PAGE_SETTINGS:
    MenuPageSettings = {
        eyebrow:
            "Full Menu",

        pageTitle:
            "Ronnie's Q Menu",

        introText:
            "Browse Ronnie's Q sandwiches, baskets, plates, Q classics, sides, desserts, drinks, and more.",

        callButtonText:
            "Call To Order",

        contactButtonText:
            "Contact Us",

        priceAvailabilityDisclaimer:
            "Prices and availability may change. Please call Ronnie's Q directly to confirm today's menu.",

        calorieDisclaimer:
            "2,000 calories a day is used for general nutrition advice, but calorie needs vary.",

        photoDisclaimer:
            "",

        callInTotalDisclaimer:
            "Totals are estimates. Final price and fees may vary when ordering.",
    };


export const DEFAULT_MENU_PAGE_CATEGORY_TEXT:
    MenuPageCategoryText[] = [
        {
            categoryId:
                "sandwiches",

            subtitle:
                "Regular and jumbo BBQ favorites.",
        },

        {
            categoryId:
                "baskets",

            subtitle:
                "Sandwich baskets with classic sides and drinks.",
        },

        {
            categoryId:
                "sandwich-fries",

            subtitle:
                "BBQ sandwiches served with fries.",
        },

        {
            categoryId:
                "plates",

            subtitle:
                "One meat, sides, and Ronnie's Q comfort.",
        },

        {
            categoryId:
                "q-classics",

            subtitle:
                "Pounds, ribs, chickens, and smoked favorites.",
        },

        {
            categoryId:
                "nachos",

            subtitle:
                "On chips or fries with BBQ meat and toppings.",
        },

        {
            categoryId:
                "sliders",

            subtitle:
                "Slider packs, lunch sliders, and catering packs.",
        },

        {
            categoryId:
                "q-bowls",

            subtitle:
                "BBQ bowls with pork, chicken, beef, and more.",
        },

        {
            categoryId:
                "loaded-potatoes",

            subtitle:
                "Loaded BBQ potatoes with your choice of meat.",
        },

        {
            categoryId:
                "family-packs",

            subtitle:
                "Built for groups, dinners, and gatherings.",
        },

        {
            categoryId:
                "catering",

            subtitle:
                "Call us for catering, group meals, and event orders.",
        },

        {
            categoryId:
                "kids-meals",

            subtitle:
                "Smaller meals for kids.",
        },

        {
            categoryId:
                "sides",

            subtitle:
                "Classic sides to complete your meal.",
        },

        {
            categoryId:
                "drinks",

            subtitle:
                "Tea, lemonade, water, and soft drinks.",
        },

        {
            categoryId:
                "desserts",

            subtitle:
                "Sweet Ronnie's Q favorites.",
        },

        {
            categoryId:
                "sauces-extras",

            subtitle:
                "Sauce, extras, and add-ons.",
        },
    ];


const DEFAULT_CALL_ONLY_CONTENT:
    MenuPageCategoryContent[] = [
        {
            categoryId:
                "catering",

            imagePath:
                "/images/menu/catering.png",

            imageValue:
                "/images/menu/catering.png",

            imageAlt:
                "Ronnie's Q catering",

            heading:
                "Call us for catering.",

            description:
                "Planning a family gathering, work lunch, church event, party, or celebration? Give us a call and we’ll help you with barbecue, sides, and portions for your group.",

            buttonText:
                "Call For Catering",
        },

        {
            categoryId:
                "desserts",

            imagePath:
                "/images/menu/banana-pudding.jpg",

            imageValue:
                "/images/menu/banana-pudding.jpg",

            imageAlt:
                "Ronnie's Q desserts",

            heading:
                "Call in to see what desserts we have.",

            description:
                "Our desserts change often, so give us a call to see what is available today.",

            buttonText:
                "Call Now",
        },
    ];


function isLocalOrFullUrl(
    path: string,
): boolean {
    return (
        path.startsWith("/") ||
        path.startsWith("http://") ||
        path.startsWith("https://")
    );
}


export const getMenuPageContent =
    cache(
        async (): Promise<MenuPageContent> => {
            const supabase =
                getPublicSupabaseClient();

            if (!supabase) {
                return {
                    items: [],

                    categories:
                        DEFAULT_CALL_ONLY_CONTENT,

                    categoryText:
                        DEFAULT_MENU_PAGE_CATEGORY_TEXT,

                    settings:
                        DEFAULT_MENU_PAGE_SETTINGS,
                };
            }


            const [
                itemsResult,
                categoriesResult,
                categoryTextResult,
                settingsResult,
            ] = await Promise.all([
                supabase
                    .from(
                        "menu_page_item_content",
                    )
                    .select(
                        `
                            item_id,
                            description,
                            image_path
                        `,
                    ),

                supabase
                    .from(
                        "menu_page_category_content",
                    )
                    .select(
                        `
                            category_id,
                            image_path,
                            heading,
                            description,
                            button_text
                        `,
                    ),

                supabase
                    .from(
                        "menu_page_category_text",
                    )
                    .select(
                        `
                            category_id,
                            subtitle
                        `,
                    ),

                supabase
                    .from(
                        "menu_page_settings",
                    )
                    .select(
                        `
                            eyebrow,
                            page_title,
                            intro_text,
                            call_button_text,
                            contact_button_text,
                            price_availability_disclaimer,
                            calorie_disclaimer,
                            photo_disclaimer,
                            call_in_total_disclaimer
                        `,
                    )
                    .eq(
                        "id",
                        1,
                    )
                    .maybeSingle(),
            ]);


            if (itemsResult.error) {
                console.error(
                    "Unable to load Menu Page item content:",
                    itemsResult.error,
                );
            }


            if (categoriesResult.error) {
                console.error(
                    "Unable to load Menu Page category content:",
                    categoriesResult.error,
                );
            }


            if (
                categoryTextResult.error
            ) {
                console.error(
                    "Unable to load Menu Page category text:",
                    categoryTextResult.error,
                );
            }


            if (settingsResult.error) {
                console.error(
                    "Unable to load Menu Page settings:",
                    settingsResult.error,
                );
            }


            const itemRows =
                (
                    itemsResult.data ??
                    []
                ) as MenuPageItemContentRow[];


            const categoryRows =
                (
                    categoriesResult.data ??
                    []
                ) as MenuPageCategoryContentRow[];


            const categoryTextRows =
                (
                    categoryTextResult.data ??
                    []
                ) as MenuPageCategoryTextRow[];


            const allImageValues = [
                ...itemRows.map(
                    (item) =>
                        item.image_path,
                ),

                ...categoryRows.map(
                    (category) =>
                        category.image_path,
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


            let mediaRows:
                MediaAssetRow[] = [];


            if (
                storagePaths.length > 0
            ) {
                const {
                    data,
                    error,
                } = await supabase
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


                if (error) {
                    console.error(
                        "Unable to load Menu Media Library details:",
                        error,
                    );
                } else {
                    mediaRows =
                        (
                            data ??
                            []
                        ) as MediaAssetRow[];
                }
            }


            const resolveImage = (
                imageValue: string,
                fallbackAlt = "",
            ) => {
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


                const mediaRow =
                    mediaRows.find(
                        (row) =>
                            row.storage_path ===
                            imageValue,
                    );


                const {
                    data:
                        publicUrlData,
                } =
                    supabase.storage
                        .from(
                            MEDIA_BUCKET,
                        )
                        .getPublicUrl(
                            imageValue,
                        );


                return {
                    imagePath:
                        publicUrlData.publicUrl,

                    imageValue,

                    imageAlt:
                        mediaRow?.alt_text ??
                        fallbackAlt,
                };
            };


            const items =
                itemRows.map(
                    (
                        item,
                    ): MenuPageItemContent => {
                        const image =
                            resolveImage(
                                item.image_path,
                            );


                        return {
                            itemId:
                                item.item_id,

                            description:
                                item.description,

                            ...image,
                        };
                    },
                );


            const categoryRowsById =
                new Map(
                    categoryRows.map(
                        (row) => [
                            row.category_id,
                            row,
                        ],
                    ),
                );


            const categoryIds =
                new Set([
                    ...DEFAULT_CALL_ONLY_CONTENT.map(
                        (item) =>
                            item.categoryId,
                    ),

                    ...categoryRows.map(
                        (item) =>
                            item.category_id,
                    ),
                ]);


            const categories =
                [...categoryIds].map(
                    (
                        categoryId,
                    ): MenuPageCategoryContent => {
                        const row =
                            categoryRowsById.get(
                                categoryId,
                            );

                        const fallback =
                            DEFAULT_CALL_ONLY_CONTENT.find(
                                (item) =>
                                    item.categoryId ===
                                    categoryId,
                            );


                        const imageValue =
                            row?.image_path ??
                            fallback?.imageValue ??
                            "/images/menu/menu-placeholder.png";


                        const image =
                            resolveImage(
                                imageValue,
                                fallback
                                    ?.imageAlt ??
                                "",
                            );


                        return {
                            categoryId,

                            heading:
                                row?.heading ??
                                fallback?.heading ??
                                "",

                            description:
                                row?.description ??
                                fallback
                                    ?.description ??
                                "",

                            buttonText:
                                row?.button_text ??
                                fallback
                                    ?.buttonText ??
                                "Call Now",

                            ...image,
                        };
                    },
                );


            const savedCategoryText =
                new Map(
                    categoryTextRows.map(
                        (row) => [
                            row.category_id,
                            row.subtitle,
                        ],
                    ),
                );


            const categoryText =
                DEFAULT_MENU_PAGE_CATEGORY_TEXT.map(
                    (item) => ({
                        categoryId:
                            item.categoryId,

                        subtitle:
                            savedCategoryText.has(
                                item.categoryId,
                            )
                                ? savedCategoryText.get(
                                    item.categoryId,
                                ) ?? ""
                                : item.subtitle,
                    }),
                );


            categoryTextRows.forEach(
                (row) => {
                    const alreadyIncluded =
                        categoryText.some(
                            (item) =>
                                item.categoryId ===
                                row.category_id,
                        );

                    if (
                        !alreadyIncluded
                    ) {
                        categoryText.push({
                            categoryId:
                                row.category_id,

                            subtitle:
                                row.subtitle,
                        });
                    }
                },
            );


            const settingsRow =
                settingsResult.data as
                    | MenuPageSettingsRow
                    | null;


            return {
                items,

                categories,

                categoryText,

                settings: {
                    eyebrow:
                        settingsRow
                            ?.eyebrow ??
                        DEFAULT_MENU_PAGE_SETTINGS
                            .eyebrow,

                    pageTitle:
                        settingsRow
                            ?.page_title ??
                        DEFAULT_MENU_PAGE_SETTINGS
                            .pageTitle,

                    introText:
                        settingsRow
                            ?.intro_text ??
                        DEFAULT_MENU_PAGE_SETTINGS
                            .introText,

                    callButtonText:
                        settingsRow
                            ?.call_button_text ??
                        DEFAULT_MENU_PAGE_SETTINGS
                            .callButtonText,

                    contactButtonText:
                        settingsRow
                            ?.contact_button_text ??
                        DEFAULT_MENU_PAGE_SETTINGS
                            .contactButtonText,

                    priceAvailabilityDisclaimer:
                        settingsRow
                            ?.price_availability_disclaimer ??
                        DEFAULT_MENU_PAGE_SETTINGS
                            .priceAvailabilityDisclaimer,

                    calorieDisclaimer:
                        settingsRow
                            ?.calorie_disclaimer ??
                        DEFAULT_MENU_PAGE_SETTINGS
                            .calorieDisclaimer,

                    photoDisclaimer:
                        settingsRow
                            ?.photo_disclaimer ??
                        DEFAULT_MENU_PAGE_SETTINGS
                            .photoDisclaimer,

                    callInTotalDisclaimer:
                        settingsRow
                            ?.call_in_total_disclaimer ??
                        DEFAULT_MENU_PAGE_SETTINGS
                            .callInTotalDisclaimer,
                },
            };
        },
    );