import { cache } from "react";

import {
    featuredMenuItems,
} from "@/data/menuItems";

import {
    MEDIA_BUCKET,
} from "@/lib/media-constants";

import {
    getPublicSupabaseClient,
} from "@/lib/supabase-public";

export type HomepageMenuFeaturedItem = {
    itemNumber: number;
    name: string;
    badge: string;
    price: string;
    description: string;
    imagePath: string;
    imageAlt: string;
};

export type HomepageMenuContent = {
    subtitle: string;
    title: string;
    noticeBeforePhone: string;
    noticeAfterPhone: string;
    buttonText: string;
    items: HomepageMenuFeaturedItem[];
};

type HomepageMenuSectionRow = {
    subtitle: string;
    title: string;
    notice_before_phone: string;
    notice_after_phone: string;
    button_text: string;
};

type HomepageMenuItemRow = {
    item_number: number;
    name: string;
    badge: string | null;
    price: string;
    description: string | null;
    image_path: string;
};

type MediaAltRow = {
    storage_path: string;
    alt_text: string;
};

const DEFAULT_HOMEPAGE_MENU_ITEMS:
    HomepageMenuFeaturedItem[] =
    featuredMenuItems
        .slice(0, 6)
        .map(
            (
                item,
                index,
            ) => ({
                itemNumber:
                    index + 1,

                name:
                    item.name,

                badge:
                    item.badge ?? "",

                price:
                    item.price,

                description:
                    item.description ?? "",

                imagePath:
                    item.image ??
                    `/images/menu-${index + 1}.png`,

                imageAlt:
                    item.alt ??
                    item.name,
            }),
        );

export const DEFAULT_HOMEPAGE_MENU:
    HomepageMenuContent = {
    subtitle:
        "Special Selection",

    title:
        "Ronnie's Q Menu",

    noticeBeforePhone:
        "Online ordering is coming soon. View Ronnie's Q favorites here, or call",

    noticeAfterPhone:
        "to place an order.",

    buttonText:
        "View Full Menu",

    items:
        DEFAULT_HOMEPAGE_MENU_ITEMS,
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

export const getHomepageMenuContent =
    cache(
        async (): Promise<HomepageMenuContent> => {
            const supabase =
                getPublicSupabaseClient();

            if (!supabase) {
                return DEFAULT_HOMEPAGE_MENU;
            }

            const supabaseClient =
                supabase;

            const [
                sectionResult,
                itemsResult,
            ] =
                await Promise.all([
                    supabaseClient
                        .from(
                            "homepage_menu_section",
                        )
                        .select(
                            `
                                subtitle,
                                title,
                                notice_before_phone,
                                notice_after_phone,
                                button_text
                            `,
                        )
                        .eq("id", 1)
                        .maybeSingle(),

                    supabaseClient
                        .from(
                            "homepage_menu_items",
                        )
                        .select(
                            `
                                item_number,
                                name,
                                badge,
                                price,
                                description,
                                image_path
                            `,
                        )
                        .order(
                            "item_number",
                            {
                                ascending: true,
                            },
                        ),
                ]);

            if (
                sectionResult.error
            ) {
                console.error(
                    "Unable to load Homepage Menu section:",
                    sectionResult.error,
                );
            }

            if (
                itemsResult.error
            ) {
                console.error(
                    "Unable to load Homepage Menu items:",
                    itemsResult.error,
                );
            }

            const sectionRow =
                sectionResult.data as
                | HomepageMenuSectionRow
                | null;

            const databaseItems =
                (
                    itemsResult.data ??
                    []
                ) as HomepageMenuItemRow[];

            const mergedItems =
                DEFAULT_HOMEPAGE_MENU_ITEMS.map(
                    (fallbackItem) => {
                        const databaseItem =
                            databaseItems.find(
                                (item) =>
                                    item.item_number ===
                                    fallbackItem.itemNumber,
                            );

                        if (!databaseItem) {
                            return {
                                ...fallbackItem,
                            };
                        }

                        return {
                            itemNumber:
                                fallbackItem.itemNumber,

                            name:
                                databaseItem.name ||
                                fallbackItem.name,

                            badge:
                                databaseItem.badge ??
                                "",

                            price:
                                databaseItem.price ||
                                fallbackItem.price,

                            description:
                                databaseItem.description ??
                                "",

                            imagePath:
                                databaseItem.image_path ||
                                fallbackItem.imagePath,

                            imageAlt:
                                fallbackItem.imageAlt,
                        };
                    },
                );

            const storagePaths = [
                ...new Set(
                    mergedItems
                        .map(
                            (item) =>
                                item.imagePath,
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
                        "Unable to load Homepage Menu Media Library details:",
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

            const resolvedItems =
                mergedItems.map(
                    (item) => {
                        if (
                            isLocalOrFullUrl(
                                item.imagePath,
                            )
                        ) {
                            return item;
                        }

                        const mediaRow =
                            mediaRows.find(
                                (row) =>
                                    row.storage_path ===
                                    item.imagePath,
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
                                    item.imagePath,
                                );

                        return {
                            ...item,

                            imagePath:
                                publicUrlData.publicUrl,

                            imageAlt:
                                mediaRow?.alt_text ||
                                item.imageAlt,
                        };
                    },
                );

            return {
                subtitle:
                    sectionRow?.subtitle ||
                    DEFAULT_HOMEPAGE_MENU
                        .subtitle,

                title:
                    sectionRow?.title ||
                    DEFAULT_HOMEPAGE_MENU
                        .title,

                noticeBeforePhone:
                    sectionRow
                        ?.notice_before_phone ||
                    DEFAULT_HOMEPAGE_MENU
                        .noticeBeforePhone,

                noticeAfterPhone:
                    sectionRow
                        ?.notice_after_phone ||
                    DEFAULT_HOMEPAGE_MENU
                        .noticeAfterPhone,

                buttonText:
                    sectionRow
                        ?.button_text ||
                    DEFAULT_HOMEPAGE_MENU
                        .buttonText,

                items:
                    resolvedItems,
            };
        },
    );