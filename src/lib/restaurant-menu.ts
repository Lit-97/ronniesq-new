import { cache } from "react";

import {
    fullMenuItems,
} from "@/data/menuItems";

import {
    getPublicSupabaseClient,
} from "@/lib/supabase-public";


export type RestaurantMenuSectionType =
    | "items"
    | "call_only";


export type RestaurantMenuOptionInputType =
    | "single"
    | "multi";


export type RestaurantMenuCategory = {
    id: string;
    name: string;
    displayOrder: number;
    imagePath: string;
    sectionType: RestaurantMenuSectionType;
    isActive: boolean;
};


export type RestaurantMenuItem = {
    id: string;
    name: string;

    priceCents: number;
    price: string;

    categoryId: string;

    isActive: boolean;
    showOnMenu: boolean;

    displayOrder: number;

    imagePath: string;
};


export type RestaurantMenuOptionChoice = {
    id: string;
    groupId: string;
    label: string;
    value: string;
    priceAdjustmentCents: number;
    priceAdjustment: number;
    isActive: boolean;
    displayOrder: number;
};


export type RestaurantMenuOptionGroup = {
    id: string;
    label: string;
    inputType: RestaurantMenuOptionInputType;
    maxSelections: number | null;
    helperText: string;
    isActive: boolean;
    displayOrder: number;
    conditionGroupId: string | null;
    conditionValue: string | null;
    choices: RestaurantMenuOptionChoice[];
};


export type RestaurantMenuItemOptionGroup = {
    itemId: string;
    groupId: string;
    isRequired: boolean;
    displayOrder: number;
    conditionGroupId: string | null;
    conditionValue: string | null;
};


export type RestaurantMenuData = {
    categories: RestaurantMenuCategory[];
    items: RestaurantMenuItem[];
    optionGroups: RestaurantMenuOptionGroup[];
    itemOptionGroups: RestaurantMenuItemOptionGroup[];
};


type MenuCategoryRow = {
    id: string;
    name: string;
    display_order: number;
    section_type: RestaurantMenuSectionType;
    is_active: boolean;
};


type MenuItemRow = {
    id: string;
    name: string;
    price_cents: number;
    category_id: string;
    is_active: boolean;
    show_on_menu: boolean;
    display_order: number;
};


type MenuOptionGroupRow = {
    id: string;
    label: string;
    input_type: RestaurantMenuOptionInputType;
    max_selections: number | null;
    helper_text: string;
    is_active: boolean;
    display_order: number;
    condition_group_id: string | null;
    condition_value: string | null;
};


type MenuOptionChoiceRow = {
    id: string;
    group_id: string;
    label: string;
    value: string;
    price_adjustment_cents: number;
    is_active: boolean;
    display_order: number;
};


type MenuItemOptionGroupRow = {
    item_id: string;
    group_id: string;
    is_required: boolean;
    display_order: number;
    condition_group_id: string | null;
    condition_value: string | null;
};


export function formatMenuPrice(
    priceCents: number,
): string {
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
        },
    ).format(
        priceCents / 100,
    );
}


function getMenuPreviewImage(
    itemId: string,
): string {

    const fullItem =
        fullMenuItems.find(
            (item) =>
                item.id ===
                itemId,
        );

    const fullImage =
        fullItem?.image?.trim();

    if (fullImage) {
        return fullImage;
    }

    return `/images/menu/${itemId}.png`;
}


export const getRestaurantMenuData =
    cache(
        async (): Promise<RestaurantMenuData> => {
            const supabase =
                getPublicSupabaseClient();

            if (!supabase) {
                return {
                    categories: [],
                    items: [],
                    optionGroups: [],
                    itemOptionGroups: [],
                };
            }


            const [
                categoriesResult,
                itemsResult,
                optionGroupsResult,
                optionChoicesResult,
                itemOptionGroupsResult,
            ] =
                await Promise.all([
                    supabase
                        .from(
                            "menu_categories",
                        )
                        .select(
                            `
                                id,
                                name,
                                display_order,
                                section_type,
                                is_active
                            `,
                        )
                        .order(
                            "display_order",
                            {
                                ascending: true,
                            },
                        ),

                    supabase
                        .from(
                            "menu_items",
                        )
                        .select(
                            `
                                id,
                                name,
                                price_cents,
                                category_id,
                                is_active,
                                show_on_menu,
                                display_order
                            `,
                        )
                        .order(
                            "category_id",
                            {
                                ascending: true,
                            },
                        )
                        .order(
                            "display_order",
                            {
                                ascending: true,
                            },
                        ),

                    supabase
                        .from(
                            "menu_option_groups",
                        )
                        .select(
                            `
                                id,
                                label,
                                input_type,
                                max_selections,
                                helper_text,
                                is_active,
                                display_order,
                                condition_group_id,
                                condition_value
                            `,
                        )
                        .order(
                            "display_order",
                            {
                                ascending: true,
                            },
                        ),

                    supabase
                        .from(
                            "menu_option_choices",
                        )
                        .select(
                            `
                                id,
                                group_id,
                                label,
                                value,
                                price_adjustment_cents,
                                is_active,
                                display_order
                            `,
                        )
                        .order(
                            "group_id",
                            {
                                ascending: true,
                            },
                        )
                        .order(
                            "display_order",
                            {
                                ascending: true,
                            },
                        ),

                    supabase
                        .from(
                            "menu_item_option_groups",
                        )
                        .select(
                            `
                                item_id,
                                group_id,
                                is_required,
                                display_order,
                                condition_group_id,
                                condition_value
                            `,
                        )
                        .order(
                            "item_id",
                            {
                                ascending: true,
                            },
                        )
                        .order(
                            "display_order",
                            {
                                ascending: true,
                            },
                        ),
                ]);


            if (
                categoriesResult.error
            ) {
                console.error(
                    "Unable to load menu categories:",
                    categoriesResult.error,
                );
            }

            if (
                itemsResult.error
            ) {
                console.error(
                    "Unable to load menu items:",
                    itemsResult.error,
                );
            }

            if (
                optionGroupsResult.error
            ) {
                console.error(
                    "Unable to load menu option groups:",
                    optionGroupsResult.error,
                );
            }

            if (
                optionChoicesResult.error
            ) {
                console.error(
                    "Unable to load menu option choices:",
                    optionChoicesResult.error,
                );
            }

            if (
                itemOptionGroupsResult.error
            ) {
                console.error(
                    "Unable to load menu item option assignments:",
                    itemOptionGroupsResult.error,
                );
            }


            const categoryRows =
                (
                    categoriesResult.data ??
                    []
                ) as MenuCategoryRow[];

            const itemRows =
                (
                    itemsResult.data ??
                    []
                ) as MenuItemRow[];

            const optionGroupRows =
                (
                    optionGroupsResult.data ??
                    []
                ) as MenuOptionGroupRow[];

            const optionChoiceRows =
                (
                    optionChoicesResult.data ??
                    []
                ) as MenuOptionChoiceRow[];

            const itemOptionGroupRows =
                (
                    itemOptionGroupsResult.data ??
                    []
                ) as MenuItemOptionGroupRow[];


            const categories:
                RestaurantMenuCategory[] =
                categoryRows.map(
                    (row) => ({
                        id:
                            row.id,

                        name:
                            row.name,

                        displayOrder:
                            row.display_order,

                        imagePath:
                            getMenuPreviewImage(
                                row.id,
                            ),

                        sectionType:
                            row.section_type,

                        isActive:
                            row.is_active,
                    }),
                );


            const items:
                RestaurantMenuItem[] =
                itemRows.map(
                    (row) => ({
                        id:
                            row.id,

                        name:
                            row.name,

                        priceCents:
                            row.price_cents,

                        price:
                            formatMenuPrice(
                                row.price_cents,
                            ),

                        categoryId:
                            row.category_id,

                        isActive:
                            row.is_active,

                        showOnMenu:
                            row.show_on_menu,

                        displayOrder:
                            row.display_order,

                        imagePath:
                            getMenuPreviewImage(
                                row.id,
                            ),
                    }),
                );


            const choicesByGroupId =
                new Map<
                    string,
                    RestaurantMenuOptionChoice[]
                >();


            optionChoiceRows.forEach(
                (row) => {
                    const choice:
                        RestaurantMenuOptionChoice = {
                            id:
                                row.id,

                            groupId:
                                row.group_id,

                            label:
                                row.label,

                            value:
                                row.value,

                            priceAdjustmentCents:
                                row.price_adjustment_cents,

                            priceAdjustment:
                                row.price_adjustment_cents /
                                100,

                            isActive:
                                row.is_active,

                            displayOrder:
                                row.display_order,
                        };


                    const current =
                        choicesByGroupId.get(
                            row.group_id,
                        ) ?? [];

                    current.push(
                        choice,
                    );

                    choicesByGroupId.set(
                        row.group_id,
                        current,
                    );
                },
            );


            const optionGroups:
                RestaurantMenuOptionGroup[] =
                optionGroupRows.map(
                    (row) => ({
                        id:
                            row.id,

                        label:
                            row.label,

                        inputType:
                            row.input_type,

                        maxSelections:
                            row.max_selections,

                        helperText:
                            row.helper_text,

                        isActive:
                            row.is_active,

                        displayOrder:
                            row.display_order,

                        conditionGroupId:
                            row.condition_group_id,

                        conditionValue:
                            row.condition_value,

                        choices:
                            (
                                choicesByGroupId.get(
                                    row.id,
                                ) ?? []
                            ).sort(
                                (a, b) =>
                                    a.displayOrder -
                                    b.displayOrder,
                            ),
                    }),
                );


            const itemOptionGroups:
                RestaurantMenuItemOptionGroup[] =
                itemOptionGroupRows.map(
                    (row) => ({
                        itemId:
                            row.item_id,

                        groupId:
                            row.group_id,

                        isRequired:
                            row.is_required,

                        displayOrder:
                            row.display_order,

                        conditionGroupId:
                            row.condition_group_id,

                        conditionValue:
                            row.condition_value,
                    }),
                );


            return {
                categories,
                items,
                optionGroups,
                itemOptionGroups,
            };
        },
    );


export const getPublicRestaurantMenuData =
    cache(
        async (): Promise<RestaurantMenuData> => {
            const data =
                await getRestaurantMenuData();

            const categories =
                data.categories.filter(
                    (category) =>
                        category.isActive,
                );

            const activeCategoryIds =
                new Set(
                    categories.map(
                        (category) =>
                            category.id,
                    ),
                );

            const items =
                data.items.filter(
                    (item) =>
                        item.isActive &&
                        item.showOnMenu &&
                        activeCategoryIds.has(
                            item.categoryId,
                        ),
                );

            const publicItemIds =
                new Set(
                    items.map(
                        (item) =>
                            item.id,
                    ),
                );

            /*
             * Keep the full group list so the client can
             * distinguish "the option tables loaded but this
             * group is inactive" from "option data could not
             * be loaded at all." Inactive groups are excluded
             * from item assignments below.
             */
            const optionGroups =
                data.optionGroups;

            const publicGroupIds =
                new Set(
                    optionGroups
                        .filter(
                            (group) =>
                                group.isActive,
                        )
                        .map(
                            (group) =>
                                group.id,
                        ),
                );

            const itemOptionGroups =
                data.itemOptionGroups.filter(
                    (assignment) =>
                        publicItemIds.has(
                            assignment.itemId,
                        ) &&
                        publicGroupIds.has(
                            assignment.groupId,
                        ),
                );


            return {
                categories,
                items,
                optionGroups,
                itemOptionGroups,
            };
        },
    );
