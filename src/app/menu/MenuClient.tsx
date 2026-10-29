"use client";

import { useEffect, useMemo, useState } from "react";
import SiteScripts from "@/components/SiteScripts";
import OrderModalController from "@/components/OrderModalController";
import { fullMenuItems, type MenuItem } from "@/data/menuItems";

import type {
    RestaurantMenuCategory,
    RestaurantMenuItem,
    RestaurantMenuItemOptionGroup,
    RestaurantMenuOptionGroup,
} from "@/lib/restaurant-menu";

import { getMenuItemDescription } from "@/data/menuDescriptions";

import type {
    MenuPageContent,
} from "@/lib/menu-page-content";

type MenuSectionId =
    string;

type MenuSection = {
    id: MenuSectionId;
    title: string;
    subtitle?: string;
    getItems: (items: MenuItem[]) => MenuItem[];
    image: string;
};

type OptionGroupId = string;
type MenuOption = {
    label: string;
    value: string;
    priceAdjustment?: number;
};

type MenuOptionGroup = {
    id: OptionGroupId;
    label: string;
    type: "single" | "multi";
    options: MenuOption[];
    maxSelections?: number;
    helperText?: string;
    required?: boolean;
    conditionGroupId?: string | null;
    conditionValue?: string | null;
};

type SelectedOptions = Partial<Record<OptionGroupId, string | string[]>>;

type CallInListOption = {
    groupId: string;
    label: string;
    value: string;
    priceAdjustment: number;
};

type CallInListItem = {
    id: string;
    menuItemId: string;
    name: string;
    price: string;
    quantity: number;
    note: string;
    options: CallInListOption[];
};

const breadItemIds = [
    "eight-pack-buns",
    "twelve-pack-buns",
    "regular-bun",
    "jumbo-buns",
    "slider-buns-pack",
    "flap-jacks",
];


const menuPlaceholderImageExtension = ".png";

function getMenuItemImage(item: MenuItem) {
    const adminImage = typeof item.image === "string" ? item.image.trim() : "";

    if (adminImage) {
        return adminImage;
    }

    return `/images/menu/${item.id}${menuPlaceholderImageExtension}`;
}

function getMenuFallbackImage(section: MenuSection) {
    return section.image || "/images/menu/menu-placeholder.png";
}



const legacyMenuOptionGroups: Record<OptionGroupId, MenuOptionGroup> = {
    sauce: {
        id: "sauce",
        label: "Sauce Preference",
        type: "single",
        options: [
            { label: "Mild", value: "Mild" },
            { label: "Hot", value: "Hot" },
            { label: "No sauce", value: "No sauce" },
        ],
    },
    "slider-style": {
        id: "slider-style",
        label: "Slider Style",
        type: "single",
        helperText: "Choose heavy sauced pork or light regular pork.\nHeavy: drenched in sauce.\nLight: regular pork with no sauce.",
        options: [
            { label: "Heavy", value: "Heavy" },
            { label: "Light", value: "Light" },
        ],
    },
    "slider-light-sauce": {
        id: "slider-light-sauce",
        label: "Light Sauce Choice",
        type: "single",
        helperText: "Required when Light is selected.",
        options: [
            { label: "Mild", value: "Mild" },
            { label: "Hot", value: "Hot" },
            { label: "No Sauce", value: "No Sauce" },
        ],
    },
    "family-pack-sauce": {
        id: "family-pack-sauce",
        label: "Sauce Preference",
        type: "single",
        options: [
            { label: "Mild", value: "Mild" },
            { label: "Hot", value: "Hot" },
            { label: "Mild & Hot", value: "Mild & Hot" },
            { label: "No sauce", value: "No sauce" },
        ],
    },
    drink: {
        id: "drink",
        label: "Drink Choice",
        type: "single",
        options: [
            { label: "Tea", value: "Tea" },
            { label: "Lemonade", value: "Lemonade" },
            { label: "Arnold Palmer", value: "Arnold Palmer" },
            { label: "Water", value: "Water" },
        ],
    },
    sides: {
        id: "sides",
        label: "Choose Sides",
        type: "multi",
        maxSelections: 2,
        helperText: "Choose up to 2 sides.",
        options: [
            { label: "Baked Beans", value: "Baked Beans" },
            { label: "White Beans", value: "White Beans" },
            { label: "Potato Salad", value: "Potato Salad" },
            { label: "Mayo Slaw", value: "Mayo Slaw" },
            { label: "Vinegar Slaw", value: "Vinegar Slaw" },
            { label: "Green Beans", value: "Green Beans" },
            { label: "Mac & Cheese", value: "Mac & Cheese" },
        ],
    },

    "family-pack-side-1": {
        id: "family-pack-side-1",
        label: "Choose Side 1",
        type: "single",
        options: [
            { label: "Baked Beans", value: "Baked Beans" },
            { label: "White Beans", value: "White Beans" },
            { label: "Potato Salad", value: "Potato Salad" },
            { label: "Mayo Slaw", value: "Mayo Slaw" },
            { label: "Vinegar Slaw", value: "Vinegar Slaw" },
            { label: "Green Beans", value: "Green Beans" },
            { label: "Mac & Cheese", value: "Mac & Cheese" },
        ],
    },

    "family-pack-side-2": {
        id: "family-pack-side-2",
        label: "Choose Side 2",
        type: "single",
        options: [
            { label: "Baked Beans", value: "Baked Beans" },
            { label: "White Beans", value: "White Beans" },
            { label: "Potato Salad", value: "Potato Salad" },
            { label: "Mayo Slaw", value: "Mayo Slaw" },
            { label: "Vinegar Slaw", value: "Vinegar Slaw" },
            { label: "Green Beans", value: "Green Beans" },
            { label: "Mac & Cheese", value: "Mac & Cheese" },
        ],
    },

    "family-pack-bread": {
        id: "family-pack-bread",
        label: "Buns or Flapjacks",
        type: "single",
        helperText: "Family packs come with buns. Choose flapjacks instead for a $3.00 upcharge.",
        options: [
            { label: "Buns", value: "Buns" },
            { label: "Flapjacks", value: "Flapjacks", priceAdjustment: 3 },
        ],
    },

    "plate-side-1": {
        id: "plate-side-1",
        label: "Choose Side 1",
        type: "single",
        options: [
            { label: "Baked Beans", value: "Baked Beans" },
            { label: "White Beans", value: "White Beans" },
            { label: "Potato Salad", value: "Potato Salad" },
            { label: "Mayo Slaw", value: "Mayo Slaw" },
            { label: "Vinegar Slaw", value: "Vinegar Slaw" },
            { label: "Green Beans", value: "Green Beans" },
            { label: "Mac & Cheese", value: "Mac & Cheese" },
        ],
    },

    "plate-side-2": {
        id: "plate-side-2",
        label: "Choose Side 2",
        type: "single",
        options: [
            { label: "Baked Beans", value: "Baked Beans" },
            { label: "White Beans", value: "White Beans" },
            { label: "Potato Salad", value: "Potato Salad" },
            { label: "Mayo Slaw", value: "Mayo Slaw" },
            { label: "Vinegar Slaw", value: "Vinegar Slaw" },
            { label: "Green Beans", value: "Green Beans" },
            { label: "Mac & Cheese", value: "Mac & Cheese" },
        ],
    },

    "side-size": {
        id: "side-size",
        label: "Choose Size",
        type: "single",
        options: [
            { label: "8 oz", value: "8 oz", priceAdjustment: 0 },
            { label: "16 oz", value: "16 oz", priceAdjustment: 1.6 },
            { label: "32 oz", value: "32 oz", priceAdjustment: 4.6 },
        ],
    },

    bread: {
        id: "bread",
        label: "Bread Choice",
        type: "single",
        options: [
            { label: "Bun", value: "Bun" },
            { label: "Flapjack", value: "Flapjack" },
        ],
    },
    jalapenos: {
        id: "jalapenos",
        label: "Jalapeños",
        type: "single",
        options: [
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
        ],
    },
    "sour-cream": {
        id: "sour-cream",
        label: "Sour Cream",
        type: "single",
        options: [
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
        ],
    },
    "potato-butter": {
        id: "potato-butter",
        label: "Butter",
        type: "single",
        options: [
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
        ],
    },
    "potato-cheese": {
        id: "potato-cheese",
        label: "Cheese",
        type: "single",
        options: [
            { label: "Shredded", value: "Shredded" },
            { label: "Melted", value: "Melted" },
        ],
    },


};

const CALL_IN_LIST_STORAGE_KEY = "ronnie-q-call-in-list";
const INCLUDE_CARD_FEE_STORAGE_KEY = "ronnie-q-include-card-fee";

const menuSections: MenuSection[] = [
    {
        id: "sandwiches",
        title: "Sandwiches",
        subtitle: "Regular and jumbo BBQ favorites.",
        getItems: (items) => items.filter((item) => item.category === "Sandwiches"),
        image: "/images/menu-3.png",
    },
    {
        id: "baskets",
        title: "Baskets",
        subtitle: "Sandwich baskets with classic sides and drinks.",
        getItems: (items) => items.filter((item) => item.category === "Baskets"),
        image: "/images/service-1.png",
    },
    {
        id: "sandwich-fries",
        title: "Sandwich & Fries",
        subtitle: "BBQ sandwiches served with fries.",
        getItems: (items) => items.filter((item) => item.category === "Sandwiches & Fries"),
        image: "/images/menu-4.png",
    },
    {
        id: "plates",
        title: "Plates",
        subtitle: "One meat, sides, and Ronnie's Q comfort.",
        getItems: (items) => items.filter((item) => item.category === "Plates"),
        image: "/images/service-2.png",
    },
    {
        id: "q-classics",
        title: "BBQ Classics",
        subtitle: "Pounds, ribs, chickens, and smoked favorites.",
        getItems: (items) => items.filter((item) => item.category === "Pounds, Ribs & Chickens"),
        image: "/images/menu-2.png",
    },
    {
        id: "nachos",
        title: "Nachos",
        subtitle: "On chips or fries with BBQ meat and toppings.",
        getItems: (items) => items.filter((item) => item.category === "Nachos"),
        image: "/images/menu-1.png",
    },
    {
        id: "sliders",
        title: "Sliders",
        subtitle: "Slider packs, lunch sliders, and catering packs.",
        getItems: (items) => items.filter((item) => item.category === "Sliders"),
        image: "/images/menu-3.png",
    },
    {
        id: "q-bowls",
        title: "BBQ Bowls",
        subtitle: "BBQ bowls with pork, chicken, beef, and more.",
        getItems: (items) => items.filter((item) => item.category === "Bowls"),
        image: "/images/service-1.png",
    },
    {
        id: "loaded-potatoes",
        title: "Loaded Potatoes",
        subtitle: "Loaded BBQ potatoes with your choice of meat.",
        getItems: (items) => items.filter((item) => item.category === "Loaded Potatoes"),
        image: "/images/service-2.png",
    },
    {
        id: "family-packs",
        title: "Family Packs",
        subtitle: "Built for groups, dinners, and gatherings.",
        getItems: (items) => items.filter((item) => item.category === "Family Packs"),
        image: "/images/menu-5.png",
    },
    {
        id: "catering",
        title: "Catering",
        subtitle: "Call us for catering, group meals, and event orders.",
        getItems: () => [],
        image: "/images/menu/catering.png",
    },
    {
        id: "kids-meals",
        title: "Kids Meals",
        subtitle: "Smaller meals for kids.",
        getItems: (items) => items.filter((item) => item.category === "Kids Meals"),
        image: "/images/menu-3.png",
    },
    {
        id: "sides",
        title: "Sides",
        subtitle: "Classic sides to complete your meal.",
        getItems: (items) =>
            items.filter((item) => item.category === "Sides" && !breadItemIds.includes(item.id)),
        image: "/images/menu-4.png",
    },
    {
        id: "drinks",
        title: "Drinks",
        subtitle: "Tea, lemonade, water, and soft drinks.",
        getItems: (items) => items.filter((item) => item.category === "Drinks"),
        image: "/images/menu-6.png",
    },
    {
        id: "desserts",
        title: "Desserts",
        subtitle: "Sweet Ronnie's Q favorites.",
        getItems: (items) => items.filter((item) => item.category === "Desserts"),
        image: "/images/menu/banana-pudding.jpg",
    },
    {
        id: "sauces-extras",
        title: "Extras",
        subtitle: "Sauce, extras, and add-ons.",
        getItems: (items) => items.filter((item) => item.category === "Sauces" || item.category === "Extras"),
        image: "/images/menu-1.png",
    },
];


function getPublicMenuCategory(
    categoryId: string,
    fallbackCategory:
        MenuItem["category"],
): MenuItem["category"] {
    switch (categoryId) {
        case "sandwiches":
            return "Sandwiches";

        case "baskets":
            return "Baskets";

        case "sandwich-fries":
            return "Sandwiches & Fries";

        case "plates":
            return "Plates";

        case "q-classics":
            return "Pounds, Ribs & Chickens";

        case "nachos":
            return "Nachos";

        case "sliders":
            return "Sliders";

        case "q-bowls":
            return "Bowls";

        case "loaded-potatoes":
            return "Loaded Potatoes";

        case "family-packs":
            return "Family Packs";

        case "kids-meals":
            return "Kids Meals";

        case "sides":
            return "Sides";

        case "drinks":
            return "Drinks";

        case "desserts":
            return "Desserts";

        case "sauces-extras":
            /*
             * Preserve whether the old
             * item was Sauce or Extra.
             */
            return fallbackCategory ===
                "Sauces"
                ? "Sauces"
                : "Extras";

        default:
            return fallbackCategory;
    }
}

function getSectionItems(
    section: MenuSection,
    items: MenuItem[],
) {
    return section.getItems(
        items,
    );
}

function isMoppedChickenItem(item: MenuItem) {
    const itemName = item.name.toLowerCase();
    const itemId = item.id.toLowerCase();

    return (
        itemName.includes("mopped chicken") ||
        itemId.includes("mopped-chicken") ||
        itemId.includes("mopped_chicken")
    );
}

function getLegacyOptionGroupsForItem(item: MenuItem, options: SelectedOptions = {}) {
    const isMoppedChicken = isMoppedChickenItem(item);

    switch (item.category) {
        case "Sandwiches":
            return isMoppedChicken ? [] : [legacyMenuOptionGroups.sauce];

        case "Baskets":
            return isMoppedChicken
                ? [legacyMenuOptionGroups.drink]
                : [legacyMenuOptionGroups.sauce, legacyMenuOptionGroups.drink];

        case "Sandwiches & Fries":
            return isMoppedChicken
                ? [legacyMenuOptionGroups.drink]
                : [legacyMenuOptionGroups.sauce, legacyMenuOptionGroups.drink];

        case "Plates":
            return isMoppedChicken
                ? [
                    legacyMenuOptionGroups["plate-side-1"],
                    legacyMenuOptionGroups["plate-side-2"],
                    legacyMenuOptionGroups.bread,
                    legacyMenuOptionGroups.drink,
                ]
                : [
                    legacyMenuOptionGroups.sauce,
                    legacyMenuOptionGroups["plate-side-1"],
                    legacyMenuOptionGroups["plate-side-2"],
                    legacyMenuOptionGroups.bread,
                    legacyMenuOptionGroups.drink,
                ];

        case "Pounds, Ribs & Chickens":
            return isMoppedChicken ? [] : [legacyMenuOptionGroups.sauce];

        case "Nachos":
            return isMoppedChicken
                ? [legacyMenuOptionGroups.jalapenos, legacyMenuOptionGroups.drink]
                : [legacyMenuOptionGroups.sauce, legacyMenuOptionGroups.jalapenos, legacyMenuOptionGroups.drink];

        case "Loaded Potatoes": {
            const potatoName = item.name.toLowerCase();

            if (potatoName.includes("plain")) {
                return [
                    legacyMenuOptionGroups["potato-butter"],
                    legacyMenuOptionGroups["potato-cheese"],
                    legacyMenuOptionGroups.jalapenos,
                    legacyMenuOptionGroups["sour-cream"],
                ];
            }

            return isMoppedChicken
                ? [
                    legacyMenuOptionGroups["potato-butter"],
                    legacyMenuOptionGroups["potato-cheese"],
                    legacyMenuOptionGroups.jalapenos,
                    legacyMenuOptionGroups["sour-cream"],
                ]
                : [
                    legacyMenuOptionGroups.sauce,
                    legacyMenuOptionGroups["potato-butter"],
                    legacyMenuOptionGroups["potato-cheese"],
                    legacyMenuOptionGroups.jalapenos,
                    legacyMenuOptionGroups["sour-cream"],
                ];
        }

        case "Family Packs":
            return isMoppedChicken
                ? [
                    legacyMenuOptionGroups["family-pack-side-1"],
                    legacyMenuOptionGroups["family-pack-side-2"],
                    legacyMenuOptionGroups["family-pack-bread"],
                ]
                : [
                    legacyMenuOptionGroups["family-pack-sauce"],
                    legacyMenuOptionGroups["family-pack-side-1"],
                    legacyMenuOptionGroups["family-pack-side-2"],
                    legacyMenuOptionGroups["family-pack-bread"],
                ];

        case "Bowls":
            return isMoppedChicken ? [] : [legacyMenuOptionGroups.sauce];

        case "Sliders": {
            const sliderName = item.name.toLowerCase();
            const sliderOptionGroups: MenuOptionGroup[] = [];

            if (!isMoppedChicken) {
                sliderOptionGroups.push(legacyMenuOptionGroups["slider-style"]);

                if (options["slider-style"] === "Light") {
                    sliderOptionGroups.push(legacyMenuOptionGroups["slider-light-sauce"]);
                }
            }

            if (sliderName.includes("lunch")) {
                sliderOptionGroups.push(legacyMenuOptionGroups.drink);
            }

            if (sliderName.includes("dinner")) {
                sliderOptionGroups.push(
                    legacyMenuOptionGroups["plate-side-1"],
                    legacyMenuOptionGroups["plate-side-2"],
                    legacyMenuOptionGroups.drink
                );
            }

            return sliderOptionGroups;
        }

        case "Kids Meals": {
            const kidsMealName = item.name.toLowerCase();

            if (kidsMealName.includes("chips") || kidsMealName.includes("drink")) {
                return isMoppedChicken
                    ? [legacyMenuOptionGroups.drink]
                    : [legacyMenuOptionGroups.sauce, legacyMenuOptionGroups.drink];
            }

            return isMoppedChicken ? [] : [legacyMenuOptionGroups.sauce];
        }

        case "Sides":
            if (item.id === "chips") {
                return [];
            }

            return [legacyMenuOptionGroups["side-size"]];

        case "Drinks": {
            const drinkName = item.name.toLowerCase();

            if (drinkName.includes("small") || drinkName.includes("large")) {
                return [legacyMenuOptionGroups.drink];
            }

            return [];
        }

        default:
            return [];
    }
}

type CustomerNoticeDisplay = {
    message: string;
    isEnabled: boolean;
};

type MenuClientProps = {
    phone: string;
    phoneHref: string;

    onlineOrderingNotice:
    CustomerNoticeDisplay | null;

    menuCategories:
    RestaurantMenuCategory[];

    menuItems:
    RestaurantMenuItem[];

    menuOptionGroups:
    RestaurantMenuOptionGroup[];

    menuItemOptionGroups:
    RestaurantMenuItemOptionGroup[];

    menuPageContent:
    MenuPageContent;
};

export default function MenuClient({
    phone,
    phoneHref,
    onlineOrderingNotice,
    menuCategories,
    menuItems,
    menuOptionGroups,
    menuItemOptionGroups,
    menuPageContent,
}: MenuClientProps) {
    const [activeSectionId, setActiveSectionId] = useState<MenuSectionId>("sandwiches");
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
    const [editingCallInItemId, setEditingCallInItemId] = useState<string | null>(null);
    const [callInList, setCallInList] = useState<CallInListItem[]>([]);
    const [includeCardFee, setIncludeCardFee] = useState(false);
    const [showRequiredOptionError, setShowRequiredOptionError] = useState(false);
    const [isCallInListVisible, setIsCallInListVisible] = useState(false);


    const getAllOptionGroupsForItem = (
        item: MenuItem,
    ): MenuOptionGroup[] => {
        /*
         * If the option tables are unavailable, keep the
         * previous menu behavior as a safe fallback.
         */
        if (
            menuOptionGroups.length ===
            0
        ) {
            return getLegacyOptionGroupsForItem(
                item,
                {
                    "slider-style":
                        "Light",
                },
            ).map(
                (group) => ({
                    ...group,
                    required:
                        true,
                }),
            );
        }


        return menuItemOptionGroups
            .filter(
                (assignment) =>
                    assignment.itemId ===
                    item.id,
            )
            .sort(
                (a, b) =>
                    a.displayOrder -
                    b.displayOrder,
            )
            .flatMap(
                (assignment) => {
                    const group =
                        menuOptionGroups.find(
                            (optionGroup) =>
                                optionGroup.id ===
                                assignment.groupId,
                        );

                    if (
                        !group ||
                        !group.isActive
                    ) {
                        return [];
                    }


                    return [
                        {
                            id:
                                group.id,

                            label:
                                group.label,

                            type:
                                group.inputType,

                            options:
                                group.choices
                                    .filter(
                                        (choice) =>
                                            choice.isActive,
                                    )
                                    .sort(
                                        (
                                            a,
                                            b,
                                        ) =>
                                            a.displayOrder -
                                            b.displayOrder,
                                    )
                                    .map(
                                        (choice) => ({
                                            label:
                                                choice.label,

                                            value:
                                                choice.value,

                                            priceAdjustment:
                                                choice.priceAdjustment,
                                        }),
                                    ),

                            maxSelections:
                                group.maxSelections ??
                                undefined,

                            helperText:
                                group.helperText ||
                                undefined,

                            required:
                                assignment.isRequired,

                            conditionGroupId:
                                assignment.conditionGroupId ??
                                group.conditionGroupId,

                            conditionValue:
                                assignment.conditionValue ??
                                group.conditionValue,
                        },
                    ];
                },
            );
    };


    const getOptionGroupsForItem = (
        item: MenuItem,
        options: SelectedOptions = {},
    ): MenuOptionGroup[] => {
        if (
            menuOptionGroups.length ===
            0
        ) {
            return getLegacyOptionGroupsForItem(
                item,
                options,
            ).map(
                (group) => ({
                    ...group,
                    required:
                        true,
                }),
            );
        }

        return getAllOptionGroupsForItem(
            item,
        ).filter(
            (group) => {
                if (
                    !group.conditionGroupId ||
                    !group.conditionValue
                ) {
                    return true;
                }

                const selectedParentValue =
                    options[
                    group.conditionGroupId
                    ];

                return (
                    selectedParentValue ===
                    group.conditionValue
                );
            },
        );
    };


    const isOptionGroupComplete = (
        group: MenuOptionGroup,
        options: SelectedOptions,
    ): boolean => {
        if (
            group.required ===
            false
        ) {
            return true;
        }

        const selectedValue =
            options[group.id];

        if (
            group.type ===
            "multi"
        ) {
            return (
                Array.isArray(
                    selectedValue,
                ) &&
                selectedValue.length >
                0
            );
        }

        return (
            typeof selectedValue ===
            "string" &&
            selectedValue.length >
            0
        );
    };


    const menuPageItemContentById =
        useMemo(
            () =>
                new Map(
                    menuPageContent.items.map(
                        (item) => [
                            item.itemId,
                            item,
                        ],
                    ),
                ),
            [
                menuPageContent.items,
            ],
        );

    const menuPageCategoryContentById =
        useMemo(
            () =>
                new Map(
                    menuPageContent.categories.map(
                        (category) => [
                            category.categoryId,
                            category,
                        ],
                    ),
                ),
            [
                menuPageContent.categories,
            ],
        );

    const menuPageCategoryTextById =
        useMemo(
            () =>
                new Map(
                    menuPageContent.categoryText.map(
                        (category) => [
                            category.categoryId,
                            category.subtitle,
                        ],
                    ),
                ),
            [
                menuPageContent.categoryText,
            ],
        );

    const publicMenuItems =
        useMemo<MenuItem[]>(() => {

            const staticItemsById =
                new Map(
                    fullMenuItems.map(
                        (item) => [
                            item.id,
                            item,
                        ],
                    ),
                );

            const categoryNameById =
                new Map(
                    menuCategories.map(
                        (category) => [
                            category.id,
                            category.name,
                        ],
                    ),
                );


            return menuItems.map(
                (adminItem) => {
                    const staticItem =
                        staticItemsById.get(
                            adminItem.id,
                        );

                    const pageContent =
                        menuPageItemContentById.get(
                            adminItem.id,
                        );

                    const fallbackCategory =
                        (
                            staticItem?.category ??
                            categoryNameById.get(
                                adminItem.categoryId,
                            ) ??
                            "Extras"
                        ) as MenuItem["category"];


                    return {

                        ...(staticItem ?? {}),

                        id:
                            adminItem.id,

                        name:
                            adminItem.name,

                        price:
                            adminItem.price,

                        category:
                            getPublicMenuCategory(
                                adminItem.categoryId,
                                fallbackCategory,
                            ),

                        image:
                            pageContent?.imagePath ??
                            staticItem?.image ??
                            adminItem.imagePath,


                        alt:
                            pageContent?.imageAlt ||
                            staticItem?.alt ||
                            adminItem.name,
                    };
                },
            );
        }, [
            menuItems,
            menuCategories,
            menuPageItemContentById,
        ]);

    const getPublicMenuItemDescription = (
        item: MenuItem,
    ) => {
        const pageContent =
            menuPageItemContentById.get(
                item.id,
            );

        return (
            pageContent?.description ||
            getMenuItemDescription(
                item,
            )
        );
    };

    const availableMenuSections =
        useMemo(() => {

            const staticSectionsById =
                new Map(
                    menuSections.map(
                        (section) => [
                            section.id,
                            section,
                        ],
                    ),
                );

            return menuCategories.map(
                (category) => {
                    const existingSection =
                        staticSectionsById.get(
                            category.id,
                        );

                    if (existingSection) {
                        return existingSection;
                    }


                    const categoryItemIds =
                        new Set(
                            menuItems
                                .filter(
                                    (item) =>
                                        item.categoryId ===
                                        category.id,
                                )
                                .map(
                                    (item) =>
                                        item.id,
                                ),
                        );


                    const newSection:
                        MenuSection = {
                        id:
                            category.id,

                        title:
                            category.name,

                        subtitle:
                            menuPageCategoryTextById.get(
                                category.id,
                            ) ?? "",

                        getItems:
                            (items) =>
                                items.filter(
                                    (item) =>
                                        categoryItemIds.has(
                                            item.id,
                                        ),
                                ),

                        image:
                            "/images/menu-1.png",
                    };


                    return newSection;
                },
            );
        }, [
            menuCategories,
            menuItems,
            menuPageCategoryTextById,
        ]);


    useEffect(() => {
        const currentSectionExists =
            availableMenuSections.some(
                (section) =>
                    section.id ===
                    activeSectionId,
            );

        if (
            !currentSectionExists &&
            availableMenuSections[0]
        ) {
            setActiveSectionId(
                availableMenuSections[0]
                    .id,
            );
        }
    }, [
        activeSectionId,
        availableMenuSections,
    ]);


    useEffect(() => {
        const savedCallInList = window.localStorage.getItem(CALL_IN_LIST_STORAGE_KEY);
        const savedIncludeCardFee = window.localStorage.getItem(INCLUDE_CARD_FEE_STORAGE_KEY);

        if (savedCallInList) {
            try {
                const parsedCallInList = JSON.parse(savedCallInList) as CallInListItem[];
                setCallInList(parsedCallInList);
            } catch {
                window.localStorage.removeItem(CALL_IN_LIST_STORAGE_KEY);
            }
        }

        if (savedIncludeCardFee) {
            setIncludeCardFee(savedIncludeCardFee === "true");
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(CALL_IN_LIST_STORAGE_KEY, JSON.stringify(callInList));
    }, [callInList]);

    useEffect(() => {
        window.localStorage.setItem(INCLUDE_CARD_FEE_STORAGE_KEY, String(includeCardFee));
    }, [includeCardFee]);

    useEffect(() => {
        if (callInList.length === 0) {
            setIsCallInListVisible(false);
            return;
        }

        const callInListSection = document.getElementById("call-in-list");

        if (!callInListSection) {
            setIsCallInListVisible(false);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsCallInListVisible(entry.isIntersecting);
            },
            {
                threshold: 0.15,
            }
        );

        observer.observe(callInListSection);

        return () => {
            observer.disconnect();
        };
    }, [callInList.length]);

    const SALES_TAX_RATE = 0.0975;
    const CARD_FEE_RATE = 0.03;

    const getPriceNumber = (price: string) => {
        return Number(price.replace(/[^0-9.]/g, "")) || 0;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getSelectedOptionAdjustment = () => {
        if (!selectedItem) return 0;

        const optionGroups = getOptionGroupsForItem(selectedItem, selectedOptions);

        return optionGroups.reduce((total, group) => {
            const selectedValue = selectedOptions[group.id];

            if (!selectedValue) return total;

            if (Array.isArray(selectedValue)) {
                const groupTotal = selectedValue.reduce((sum, value) => {
                    const matchingOption = group.options.find(
                        (option) => option.value === value
                    );

                    return sum + (matchingOption?.priceAdjustment ?? 0);
                }, 0);

                return total + groupTotal;
            }

            const matchingOption = group.options.find(
                (option) => option.value === selectedValue
            );

            return total + (matchingOption?.priceAdjustment ?? 0);
        }, 0);
    };

    const getSelectedItemDisplayPrice = () => {
        if (!selectedItem) return "$0.00";

        const basePrice = getPriceNumber(selectedItem.price);
        const optionAdjustment = getSelectedOptionAdjustment();

        return formatCurrency(basePrice + optionAdjustment);
    };


    const hasRequiredOptionsSelected = () => {
        if (!selectedItem) {
            return false;
        }

        const optionGroups =
            getOptionGroupsForItem(
                selectedItem,
                selectedOptions,
            );

        return optionGroups.every(
            (group) =>
                isOptionGroupComplete(
                    group,
                    selectedOptions,
                ),
        );
    };


    const getCallInItemOptionTotal = (item: CallInListItem) => {
        return item.options.reduce((total, option) => {
            return total + (option.priceAdjustment ?? 0);
        }, 0);
    };

    const getCallInItemTotal = (item: CallInListItem) => {
        return (getPriceNumber(item.price) + getCallInItemOptionTotal(item)) * item.quantity;
    };

    const callInSubtotal = callInList.reduce((total, item) => {
        return total + getCallInItemTotal(item);
    }, 0);

    const estimatedSalesTax = callInSubtotal * SALES_TAX_RATE;
    const estimatedCardFee = includeCardFee ? callInSubtotal * CARD_FEE_RATE : 0;
    const estimatedTotal = callInSubtotal + estimatedSalesTax + estimatedCardFee;

    const activeSection =
        useMemo(() => {
            return (
                availableMenuSections.find(
                    (section) =>
                        section.id ===
                        activeSectionId,
                ) ??
                availableMenuSections[0] ??
                menuSections[0]
            );
        }, [
            activeSectionId,
            availableMenuSections,
        ]);

    const activeItems =
        useMemo(() => {
            return [
                ...getSectionItems(
                    activeSection,
                    publicMenuItems,
                ),
            ].sort((a, b) => {
                const priceA =
                    Number(
                        a.price.replace(
                            /[^0-9.]/g,
                            "",
                        ),
                    );

                const priceB =
                    Number(
                        b.price.replace(
                            /[^0-9.]/g,
                            "",
                        ),
                    );

                return priceA - priceB;
            });
        }, [
            activeSection,
            publicMenuItems,
        ]);

    const activeCategory =
        menuCategories.find(
            (category) =>
                category.id ===
                activeSection.id,
        );

    const activeCategorySubtitle =
        menuPageCategoryTextById.get(
            activeSection.id,
        ) ??
        activeSection.subtitle ??
        "";


    const isCallOnlySection =
        activeCategory?.sectionType ===
        "call_only";


    const callOnlyContent =
        menuPageContent.categories.find(
            (category) =>
                category.categoryId ===
                activeSection.id,
        );


    const featureSection = {
        category:
            activeCategory?.name ??
            activeSection.title,

        image:
            callOnlyContent?.imagePath ??
            activeSection.image,

        alt:
            callOnlyContent?.imageAlt ||
            `${activeSection.title} at Ronnie's Q`,

        heading:
            callOnlyContent?.heading ??
            `Call us for ${activeSection.title.toLowerCase()}.`,

        text:
            callOnlyContent?.description ??
            activeSection.subtitle ??
            "",

        buttonText:
            callOnlyContent?.buttonText ??
            "Call Now",
    };

    const openItemDetails = (item: MenuItem) => {
        setSelectedItem(item);
        setQuantity(1);
        setNote("");
        setSelectedOptions({});
        setEditingCallInItemId(null);
        setShowRequiredOptionError(false);
    };

    const openEditCallInItem = (callInItem: CallInListItem) => {
        const menuItem =
            publicMenuItems.find(
                (item) =>
                    item.id ===
                    callInItem.menuItemId,
            );

        if (!menuItem) return;

        setSelectedItem(menuItem);
        setQuantity(callInItem.quantity);
        setNote(callInItem.note);
        setSelectedOptions(convertCallInOptionsToSelectedOptions(menuItem, callInItem.options));
        setEditingCallInItemId(callInItem.id);
    };

    const updateSingleOption = (
        groupId: OptionGroupId,
        value: string,
    ) => {
        setSelectedOptions(
            (current) => {
                const nextOptions:
                    SelectedOptions = {
                    ...current,

                    [groupId]:
                        value,
                };


                /*
                 * If this selection controls another
                 * conditional group, clear the child
                 * value whenever its condition no
                 * longer matches.
                 */
                if (selectedItem) {
                    getAllOptionGroupsForItem(
                        selectedItem,
                    )
                        .filter(
                            (group) =>
                                group.conditionGroupId ===
                                groupId &&
                                group.conditionValue !==
                                value,
                        )
                        .forEach(
                            (group) => {
                                delete nextOptions[
                                    group.id
                                ];
                            },
                        );
                }


                return nextOptions;
            },
        );

        setShowRequiredOptionError(
            false,
        );
    };


    const updateMultiOption = (
        groupId: OptionGroupId,
        value: string,
        maxSelections?: number
    ) => {
        setSelectedOptions((currentOptions) => {
            const currentValues = Array.isArray(currentOptions[groupId])
                ? (currentOptions[groupId] as string[])
                : [];

            const isSelected = currentValues.includes(value);

            if (isSelected) {
                return {
                    ...currentOptions,
                    [groupId]: currentValues.filter((item) => item !== value),
                };
            }

            if (maxSelections && currentValues.length >= maxSelections) {
                return currentOptions;
            }

            return {
                ...currentOptions,
                [groupId]: [...currentValues, value],
            };
        });

        setShowRequiredOptionError(
            false,
        );
    };

    const formatSelectedOptions = (
        item: MenuItem,
        options: SelectedOptions
    ): CallInListOption[] => {
        return getOptionGroupsForItem(item, options)
            .flatMap((group) => {
                const selectedValue = options[group.id];

                if (!selectedValue) return [];

                const selectedValues = Array.isArray(selectedValue)
                    ? selectedValue
                    : [selectedValue];

                return selectedValues
                    .map((value) => {
                        const matchingOption = group.options.find(
                            (option) => option.value === value
                        );

                        if (!matchingOption) return null;

                        return {
                            groupId:
                                group.id,
                            label:
                                group.label,
                            value:
                                matchingOption.value,
                            priceAdjustment:
                                matchingOption.priceAdjustment ??
                                0,
                        };
                    })
                    .filter((option): option is CallInListOption => Boolean(option));
            });
    };

    const convertCallInOptionsToSelectedOptions = (
        item: MenuItem,
        savedOptions: CallInListOption[]
    ): SelectedOptions => {
        const nextOptions: SelectedOptions = {};
        const optionGroups =
            getAllOptionGroupsForItem(
                item,
            );

        savedOptions.forEach(
            (savedOption) => {
                const matchingGroup =
                    optionGroups.find(
                        (group) =>
                            savedOption.groupId
                                ? group.id ===
                                savedOption.groupId
                                : group.label ===
                                savedOption.label,
                    );

                if (!matchingGroup) return;

                if (matchingGroup.type === "multi") {
                    const currentValues = Array.isArray(nextOptions[matchingGroup.id])
                        ? (nextOptions[matchingGroup.id] as string[])
                        : [];

                    nextOptions[matchingGroup.id] = [...currentValues, savedOption.value];
                } else {
                    nextOptions[matchingGroup.id] = savedOption.value;
                }
            });

        return nextOptions;
    };

    const addItemToCallInList = (
        item: MenuItem,
        itemQuantity = 1,
        itemNote = ""
    ) => {
        const cleanNote = itemNote.trim();

        setCallInList((currentList) => {
            const existingQuickItem = currentList.find(
                (listItem) => listItem.menuItemId === item.id && listItem.note === "" && cleanNote === ""
            );

            if (existingQuickItem) {
                return currentList.map((listItem) =>
                    listItem.id === existingQuickItem.id
                        ? { ...listItem, quantity: listItem.quantity + itemQuantity }
                        : listItem
                );
            }

            const newItem: CallInListItem = {
                id: `${item.id}-${Date.now()}`,
                menuItemId: item.id,
                name: item.name,
                price: item.price,
                quantity: itemQuantity,
                note: cleanNote,
                options: [],
            };

            return [...currentList, newItem];
        });
    };

    const addToCallInList = () => {
        if (!selectedItem) return;

        if (!hasRequiredOptionsSelected()) {
            setShowRequiredOptionError(true);
            return;
        }

        setShowRequiredOptionError(false);

        const updatedItem: CallInListItem = {
            id: editingCallInItemId ?? `${selectedItem.id}-${Date.now()}`,
            menuItemId: selectedItem.id,
            name: selectedItem.name,
            price: selectedItem.price,
            quantity,
            note: note.trim(),
            options: formatSelectedOptions(selectedItem, selectedOptions),
        };

        if (editingCallInItemId) {
            setCallInList((currentList) =>
                currentList.map((item) =>
                    item.id === editingCallInItemId ? updatedItem : item
                )
            );
        } else {
            setCallInList((currentList) => [...currentList, updatedItem]);
        }

        setSelectedItem(null);
        setQuantity(1);
        setNote("");
        setSelectedOptions({});
        setEditingCallInItemId(null);
    };

    const getQuickListItem = (menuItemId: string) => {
        return callInList.find(
            (item) => item.menuItemId === menuItemId && item.note === ""
        );
    };

    const quickAddItem = (item: MenuItem) => {
        if (
            getOptionGroupsForItem(
                item,
                {},
            ).length >
            0
        ) {
            openItemDetails(
                item,
            );

            return;
        }

        addItemToCallInList(
            item,
            1,
        );
    };

    const increaseQuickItem = (menuItemId: string) => {
        setCallInList((currentList) =>
            currentList.map((item) =>
                item.menuItemId === menuItemId && item.note === ""
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQuickItem = (menuItemId: string) => {
        setCallInList((currentList) =>
            currentList
                .map((item) =>
                    item.menuItemId === menuItemId && item.note === ""
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCallInList = (id: string) => {
        setCallInList((currentList) => currentList.filter((item) => item.id !== id));
    };

    const clearCallInList = () => {
        setCallInList([]);
        setIncludeCardFee(false);
        window.localStorage.removeItem(CALL_IN_LIST_STORAGE_KEY);
        window.localStorage.removeItem(INCLUDE_CARD_FEE_STORAGE_KEY);
    };


    return (
        <>


            <main>
                <section className="section full-menu bg-black-10" aria-labelledby="full-menu-label">
                    <div className="container">
                        <p className="section-subtitle label-2 text-center">
                            {
                                menuPageContent
                                    .settings
                                    .eyebrow
                            }
                        </p>

                        <h1
                            className="headline-1 section-title text-center"
                            id="full-menu-label"
                        >
                            {
                                menuPageContent
                                    .settings
                                    .pageTitle
                            }
                        </h1>

                        <div className="full-menu-intro text-center">
                            <p>
                                {
                                    menuPageContent
                                        .settings
                                        .introText
                                }
                            </p>

                            {onlineOrderingNotice?.isEnabled && (
                                <p>
                                    {onlineOrderingNotice.message}
                                </p>
                            )}
                        </div>

                        <div className="full-menu-actions">
                            <a
                                href={phoneHref}
                                className="btn btn-secondary"
                            >
                                <span className="text text-1">
                                    {
                                        menuPageContent
                                            .settings
                                            .callButtonText
                                    }
                                </span>

                                <span
                                    className="text text-2"
                                    aria-hidden="true"
                                >
                                    {
                                        menuPageContent
                                            .settings
                                            .callButtonText
                                    }
                                </span>
                            </a>

                            <a href="/contact" className="btn btn-primary">
                                <span className="text text-1">{
                                    menuPageContent
                                        .settings
                                        .contactButtonText
                                }</span>
                                <span className="text text-2" aria-hidden="true">
                                    {
                                        menuPageContent
                                            .settings
                                            .contactButtonText
                                    }
                                </span>
                            </a>
                        </div>

                        <div className="menu-content-header">
                            <div>
                                <p className="section-subtitle label-2">{activeSection.title}</p>

                                <h2 className="headline-1 section-title">{activeSection.title}</h2>

                                {activeCategorySubtitle && (
                                    <p className="menu-content-subtitle">
                                        {activeCategorySubtitle}
                                    </p>
                                )}
                            </div>

                            <span className="menu-content-count label-2">
                                {isCallOnlySection
                                    ? "Call"
                                    : `${activeItems.length} ${activeItems.length === 1 ? "item" : "items"}`}
                            </span>
                        </div>

                        <div className={`menu-page-layout ${callInList.length > 0 ? "has-call-list" : ""}`}>
                            <aside className="menu-sidebar" aria-label="Menu categories">
                                <p className="menu-sidebar-title label-2">Menu Categories</p>

                                <div className="menu-sidebar-list">
                                    {availableMenuSections.map(
                                        (section) => {
                                            const sectionItems =
                                                getSectionItems(
                                                    section,
                                                    publicMenuItems,
                                                );

                                            const sectionCategory =
                                                menuCategories.find(
                                                    (category) =>
                                                        category.id ===
                                                        section.id,
                                                );


                                            const sectionIsCallOnly =
                                                sectionCategory?.sectionType ===
                                                "call_only";

                                            const isActive = activeSectionId === section.id;


                                            return (
                                                <div className="menu-sidebar-group" key={section.id}>
                                                    <button
                                                        type="button"
                                                        className={`menu-sidebar-button ${isActive ? "active" : ""}`}
                                                        onClick={() => setActiveSectionId(section.id)}
                                                    >
                                                        <span>{section.title}</span>
                                                        <span className="menu-sidebar-count">
                                                            {sectionIsCallOnly
                                                                ? "Call"
                                                                : sectionItems.length}
                                                        </span>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                </div>
                            </aside>

                            <div className="menu-content">
                                {isCallOnlySection ? (
                                    <div className="menu-card-grid">
                                        <article
                                            className="menu-item-card"
                                            style={{
                                                gridColumn: "1 / -1",
                                                position: "relative",
                                                overflow: "hidden",
                                                minHeight: "675px",
                                                borderRadius: "24px",
                                            }}
                                        >
                                            <figure
                                                className="menu-item-card-image"
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    height: "100%",
                                                }}
                                            >
                                                <img
                                                    src={featureSection.image}
                                                    alt={featureSection.alt}
                                                    loading="lazy"
                                                    className="img-cover"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        objectPosition: "center",
                                                        display: "block",
                                                    }}
                                                />
                                            </figure>

                                            <div
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    background:
                                                        "linear-gradient(to top, rgba(0, 0, 0, 0.82), rgba(0, 0, 0, 0.35))",
                                                }}
                                            />

                                            <div
                                                style={{
                                                    position: "relative",
                                                    zIndex: 1,
                                                    minHeight: "675px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    padding: "32px",
                                                }}
                                            >
                                                <span
                                                    className="menu-item-card-category label-2"
                                                    style={{ marginBottom: "12px" }}
                                                >
                                                    {featureSection.category}
                                                </span>

                                                <h3
                                                    className="headline-2"
                                                    style={{ color: "#ffffff", marginBottom: "14px" }}
                                                >
                                                    {featureSection.heading}
                                                </h3>

                                                <p
                                                    className="menu-item-card-text"
                                                    style={{
                                                        color: "rgba(255, 255, 255, 0.88)",
                                                        maxWidth: "560px",
                                                        marginBottom: "28px",
                                                        marginInline: "auto",
                                                    }}
                                                >
                                                    {featureSection.text}
                                                </p>

                                                <div>
                                                    <a
                                                        href={phoneHref}
                                                        className="btn btn-secondary"
                                                    >
                                                        <span className="text text-1">
                                                            {featureSection.buttonText}
                                                        </span>

                                                        <span
                                                            className="text text-2"
                                                            aria-hidden="true"
                                                        >
                                                            {featureSection.buttonText}
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                ) : (
                                    <div className="menu-card-grid">
                                        {activeItems.map((item) => (
                                            <article
                                                className="menu-item-card"
                                                key={item.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => openItemDetails(item)}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === " ") {
                                                        event.preventDefault();
                                                        openItemDetails(item);
                                                    }
                                                }}
                                            >
                                                <figure className="menu-item-card-image">
                                                    <img
                                                        src={getMenuItemImage(item)}
                                                        alt={item.alt ?? item.name}
                                                        loading="lazy"
                                                        className="img-cover"
                                                        onError={(event) => {
                                                            const image = event.currentTarget;
                                                            image.onerror = null;
                                                            image.src = getMenuFallbackImage(activeSection);
                                                        }}
                                                    />
                                                </figure>

                                                <div className="menu-item-card-content">
                                                    <div className="menu-item-card-top">
                                                        <span className="menu-item-card-category label-2">
                                                            {item.category}
                                                        </span>

                                                        {item.badge && (
                                                            <span className="menu-item-card-badge label-2">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="title-2 menu-item-card-title">{item.name}</h3>

                                                    <p className="menu-item-card-text">
                                                        {getPublicMenuItemDescription(
                                                            item,
                                                        )}
                                                    </p>

                                                    <div className="menu-item-card-footer">
                                                        <span className="title-2 menu-item-card-price">{item.price}</span>

                                                        {(() => {
                                                            const quickItem = getQuickListItem(item.id);

                                                            if (!quickItem) {
                                                                return (
                                                                    <button
                                                                        type="button"
                                                                        className="menu-item-card-add label-2"
                                                                        onClick={(event) => {
                                                                            event.stopPropagation();
                                                                            quickAddItem(item);
                                                                        }}
                                                                    >
                                                                        Add To Call-In List
                                                                    </button>
                                                                );
                                                            }

                                                            return (
                                                                <div
                                                                    className="menu-item-card-quantity"
                                                                    onClick={(event) => event.stopPropagation()}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        aria-label={`Remove one ${item.name}`}
                                                                        onClick={() => decreaseQuickItem(item.id)}
                                                                    >
                                                                        −
                                                                    </button>

                                                                    <span>{quickItem.quantity}</span>

                                                                    <button
                                                                        type="button"
                                                                        aria-label={`Add one more ${item.name}`}
                                                                        onClick={() => increaseQuickItem(item.id)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {callInList.length > 0 && (
                                <aside id="call-in-list" className="call-in-list" aria-label="Call-in order list">
                                    <div className="call-in-list-header">
                                        <div>
                                            <p className="section-subtitle label-2">Call-In List</p>
                                            <h2 className="title-1">Your Order Notes</h2>
                                        </div>

                                        <span className="call-in-list-count label-2">
                                            {callInList.length} items
                                        </span>
                                    </div>

                                    <ul className="call-in-list-items">
                                        {callInList.map((item) => (
                                            <li className="call-in-list-item" key={item.id}>
                                                <div className="call-in-list-item-main">
                                                    <p className="call-in-list-name">
                                                        {item.quantity}x {item.name}
                                                    </p>

                                                    <p className="call-in-list-price">
                                                        {formatCurrency(getCallInItemTotal(item))}
                                                    </p>

                                                    {item.options.length > 0 && (
                                                        <ul className="call-in-list-options">
                                                            {item.options.map((option, index) => (
                                                                <li key={`${item.id}-${option.label}-${option.value}-${index}`}>
                                                                    <span>{option.label}:</span> {option.value}

                                                                    {option.priceAdjustment > 0 && option.label !== "Choose Size" && (
                                                                        <strong> +{formatCurrency(option.priceAdjustment)}</strong>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}

                                                    {item.note && (
                                                        <p className="call-in-list-note">Note: {item.note}</p>
                                                    )}
                                                </div>

                                                <div className="call-in-list-item-actions">
                                                    <button
                                                        type="button"
                                                        className="call-in-list-edit"
                                                        onClick={() => openEditCallInItem(item)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="call-in-list-delete"
                                                        onClick={() => removeFromCallInList(item.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="call-in-list-total">
                                        <div className="call-in-list-total-row">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(callInSubtotal)}</span>
                                        </div>

                                        <div className="call-in-list-total-row">
                                            <span>Estimated sales tax</span>
                                            <span>{formatCurrency(estimatedSalesTax)}</span>
                                        </div>

                                        <label className="call-in-card-fee-toggle">
                                            <input
                                                type="checkbox"
                                                checked={includeCardFee}
                                                onChange={(event) => setIncludeCardFee(event.target.checked)}
                                            />

                                            <span>Include 3% card fee</span>
                                        </label>

                                        {includeCardFee && (
                                            <div className="call-in-list-total-row">
                                                <span>Card fee</span>
                                                <span>{formatCurrency(estimatedCardFee)}</span>
                                            </div>
                                        )}

                                        <div className="call-in-list-total-row call-in-list-grand-total">
                                            <span>Estimated total</span>
                                            <span>{formatCurrency(estimatedTotal)}</span>
                                        </div>

                                        <p className="call-in-list-total-note">
                                            {
                                                menuPageContent
                                                    .settings
                                                    .callInTotalDisclaimer
                                            }
                                        </p>
                                    </div>

                                    <div className="call-in-list-actions">
                                        <a
                                            href={phoneHref}
                                            className="btn btn-secondary"
                                        >
                                            <span className="text text-1">
                                                Call Ronnie&apos;s Q
                                            </span>

                                            <span
                                                className="text text-2"
                                                aria-hidden="true"
                                            >
                                                Call Ronnie&apos;s Q
                                            </span>
                                        </a>

                                        <button type="button" className="btn btn-primary" onClick={clearCallInList}>
                                            <span className="text text-1">Clear List</span>
                                            <span className="text text-2" aria-hidden="true">
                                                Clear List
                                            </span>
                                        </button>
                                    </div>
                                </aside>
                            )}

                        </div>

                        <div className="full-menu-bottom text-center">
                            <div className="menu-disclaimer-card">
                                <p className="body-4">
                                    {
                                        menuPageContent
                                            .settings
                                            .priceAvailabilityDisclaimer
                                    }
                                </p>

                                <p className="menu-calorie-note">
                                    {
                                        menuPageContent
                                            .settings
                                            .calorieDisclaimer
                                    }
                                </p>

                                <p className="menu-photo-note">
                                    {
                                        menuPageContent
                                            .settings
                                            .photoDisclaimer
                                    }
                                </p>
                            </div>

                            <a
                                href={phoneHref}
                                className="btn btn-primary"
                            >
                                <span className="text text-1">
                                    Call Now
                                </span>

                                <span
                                    className="text text-2"
                                    aria-hidden="true"
                                >
                                    Call Now
                                </span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {callInList.length > 0 && !isCallInListVisible && (
                <div className="mobile-call-list-bar">
                    <div>
                        <p className="mobile-call-list-label">Call-In List</p>
                        <p className="mobile-call-list-text">
                            {callInList.length} {callInList.length === 1 ? "item" : "items"} ·{" "}
                            {formatCurrency(estimatedTotal)}
                        </p>
                    </div>

                    <a href="#call-in-list" className="mobile-call-list-button">
                        View
                    </a>
                </div>
            )}



            <a href="#top" className="back-top-btn" aria-label="back to top" data-back-top-btn>
                <svg
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M112 328L256 184L400 328"
                        stroke="currentColor"
                        strokeWidth="48"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </a>

            {selectedItem && (
                <div
                    className="menu-detail-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="menu-detail-title"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="menu-detail-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="menu-detail-close"
                            aria-label="Close menu item details"
                            onClick={() => {
                                setSelectedItem(null);
                                setEditingCallInItemId(null);
                                setQuantity(1);
                                setNote("");
                                setSelectedOptions({});
                            }}
                        >
                            ×
                        </button>

                        <figure className="menu-detail-image">
                            <img
                                src={getMenuItemImage(selectedItem)}
                                alt={selectedItem.alt ?? selectedItem.name}
                                className="img-cover"
                                onError={(event) => {
                                    const image = event.currentTarget;
                                    image.onerror = null;
                                    image.src = getMenuFallbackImage(activeSection);
                                }}
                            />
                        </figure>

                        <div className="menu-detail-content">
                            <p className="section-subtitle label-2">{selectedItem.category}</p>

                            <h2 className="headline-1 menu-detail-title" id="menu-detail-title">
                                {selectedItem.name}
                            </h2>

                            <p className="title-2 menu-detail-price">{getSelectedItemDisplayPrice()}</p>

                            <p className="menu-detail-text">
                                {getPublicMenuItemDescription(
                                    selectedItem,
                                )}
                            </p>

                            <div className="menu-detail-form">

                                {getOptionGroupsForItem(selectedItem, selectedOptions).length > 0 && (
                                    <div className="menu-detail-options">
                                        {getOptionGroupsForItem(selectedItem, selectedOptions).map((group) => (
                                            <div className="menu-option-group" key={group.id}>
                                                <div className="menu-option-group-heading">
                                                    <p className="label-2">{group.label}</p>

                                                    {group.helperText && (
                                                        <span className="menu-option-helper">{group.helperText}</span>
                                                    )}
                                                </div>

                                                <div className="menu-option-list">
                                                    {group.options.map((option) => {
                                                        const selectedValue = selectedOptions[group.id];
                                                        const isSelected =
                                                            group.type === "single"
                                                                ? selectedValue === option.value
                                                                : Array.isArray(selectedValue) && selectedValue.includes(option.value);

                                                        return (
                                                            <button
                                                                type="button"
                                                                key={option.value}
                                                                className={`menu-option-button ${isSelected ? "selected" : ""}`}
                                                                onClick={() => {
                                                                    if (group.type === "single") {
                                                                        updateSingleOption(group.id, option.value);
                                                                    } else {
                                                                        updateMultiOption(group.id, option.value, group.maxSelections);
                                                                    }
                                                                }}
                                                            >
                                                                <span className="menu-option-inline">
                                                                    <span>{option.label}</span>

                                                                    {option.priceAdjustment && group.id !== "side-size" ? (
                                                                        <small className="menu-option-price">+{formatCurrency(option.priceAdjustment)}</small>
                                                                    ) : null}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {showRequiredOptionError &&
                                                    !isOptionGroupComplete(
                                                        group,
                                                        selectedOptions,
                                                    ) ? (
                                                    <p className="menu-option-error">
                                                        Please choose an option for {group.label}.
                                                    </p>
                                                ) : null}


                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="menu-detail-quantity">
                                    <p className="label-2">Quantity</p>

                                    <div className="quantity-control">
                                        <button
                                            type="button"
                                            aria-label="Decrease quantity"
                                            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                        >
                                            −
                                        </button>

                                        <span>{quantity}</span>

                                        <button
                                            type="button"
                                            aria-label="Increase quantity"
                                            onClick={() => setQuantity((current) => current + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <label className="menu-detail-note">
                                    <span className="label-2">Special Instructions</span>

                                    <textarea
                                        value={note}
                                        onChange={(event) => setNote(event.target.value)}
                                        placeholder="Example: sauce on the side, no slaw, extra napkins..."
                                    />
                                </label>
                            </div>

                            <div className="menu-detail-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={addToCallInList}
                                >
                                    <span className="text text-1">
                                        {editingCallInItemId ? "Update List" : "Add To Call-In List"}
                                    </span>
                                    <span className="text text-2" aria-hidden="true">
                                        {editingCallInItemId ? "Update List" : "Add To Call-In List"}
                                    </span>
                                </button>

                                <a
                                    href={phoneHref}
                                    className="btn btn-primary"
                                >
                                    <span className="text text-1">
                                        Call Now
                                    </span>

                                    <span
                                        className="text text-2"
                                        aria-hidden="true"
                                    >
                                        Call Now
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <OrderModalController phoneHref={phoneHref} />

            <SiteScripts />
        </>
    );
}
