
import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase-public";

/*-----------------------------------*\
  #DEFAULT CONTACT PAGE CONTENT
\*-----------------------------------*/

export const DEFAULT_CONTACT_PAGE_CONTENT = {
    hero: {
        subtitle: "Get in Touch",

        titleLine1: "Let's Talk",

        titleLine2: "Barbecue.",

        description:
            "Have a question about the menu, catering, a large order, or visiting Ronnie's Q? Give us a call or send us a message.",

        callButtonText: "Call Ronnie's Q",

        menuButtonText: "View Our Menu",

        bannerKicker: "Slow-Smoked • Southern-Made",

        bannerTitle: "Come Hungry.",

        bannerDescriptionBeforeCity:
            "Slow-smoked barbecue, Southern sides, and hometown service in the heart of",
    },

    options: {
        subtitle: "Contact Options",

        title: "Reach Ronnie's Q Your Way",

        description:
            "Calling is the fastest way to ask about today's menu, specials, availability, or a same-day order.",

        callDescription:
            "Call during restaurant hours for orders, menu questions, and faster assistance.",

        emailDescription:
            "Email us about catering, future events, business questions, and other non-urgent requests.",

        visitDescriptionBeforeCity:
            "Find us in",

        visitDescriptionAfterCity:
            "for dine-in service, takeout, and Southern barbecue.",

        callAction: "Call Ronnie's Q",

        emailAction: "Send an Email",

        visitAction: "Open Google Maps",
    },

    message: {
        subtitle: "Send a Message",

        title: "How Can We Help?",

        description:
            "Tell us what you are contacting us about and include any helpful details. For same-day orders or urgent questions, please call the restaurant instead.",

        fastAnswerTitle: "Need a faster answer?",

        inquiryHeading: "Contact us about:",

        inquiry1: "Menu or order questions",

        inquiry2: "Catering requests",

        inquiry3: "Events and large orders",

        inquiry4: "Restaurant feedback",

        inquiry5: "General questions",
    },

    location: {
        subtitle: "Visit Ronnie's Q",

        titlePrefix: "Find Us in",

        directionsButtonText: "Get Directions",
    },
};

/*-----------------------------------*\
  #TYPES
\*-----------------------------------*/

export type ContactPageContent =
    typeof DEFAULT_CONTACT_PAGE_CONTENT;

export type ContactPageSection =
    keyof ContactPageContent;

export type ContactEditorField = {
    name: string;
    label: string;
    maxLength: number;
    rows?: number;
    wide?: boolean;
    help?: string;
};

export type ContactEditorSection = {
    id: ContactPageSection;
    eyebrow: string;
    title: string;
    description: string;
    note: string;
    fields: ContactEditorField[];
};

/*-----------------------------------*\
  #EDITABLE SECTIONS
\*-----------------------------------*/

export const CONTACT_PAGE_EDITOR_SECTIONS:
    ContactEditorSection[] = [
        {
            id: "hero",

            eyebrow: "Contact Page Hero",

            title: "Hero",

            description:
                "Edit the headline, introduction, buttons, and promotional banner.",

            note:
                "Restaurant name, city, phone number, address, and business hours remain protected.",

            fields: [
                {
                    name: "subtitle",
                    label: "Subtitle",
                    maxLength: 80,
                },
                {
                    name: "titleLine1",
                    label: "Headline Line 1",
                    maxLength: 80,
                },
                {
                    name: "titleLine2",
                    label: "Headline Line 2",
                    maxLength: 80,
                },
                {
                    name: "description",
                    label: "Description",
                    maxLength: 400,
                    rows: 4,
                    wide: true,
                },
                {
                    name: "callButtonText",
                    label: "Call Button Text",
                    maxLength: 60,
                },
                {
                    name: "menuButtonText",
                    label: "Menu Link Text",
                    maxLength: 60,
                },
                {
                    name: "bannerKicker",
                    label: "Banner Subtitle",
                    maxLength: 100,
                },
                {
                    name: "bannerTitle",
                    label: "Banner Heading",
                    maxLength: 100,
                },
                {
                    name: "bannerDescriptionBeforeCity",
                    label: "Banner Description Before City",
                    maxLength: 250,
                    rows: 3,
                    wide: true,
                    help:
                        "The city is automatically inserted at the end.",
                },
            ],
        },

        {
            id: "options",

            eyebrow: "Contact Page Options",

            title: "Contact Options",

            description:
                "Manage the introduction and three contact-method cards.",

            note:
                "Phone numbers, email addresses, and directions stay connected to Site Settings.",

            fields: [
                {
                    name: "subtitle",
                    label: "Subtitle",
                    maxLength: 80,
                },
                {
                    name: "title",
                    label: "Section Heading",
                    maxLength: 120,
                },
                {
                    name: "description",
                    label: "Introduction",
                    maxLength: 400,
                    rows: 4,
                    wide: true,
                },
                {
                    name: "callDescription",
                    label: "Call Card Description",
                    maxLength: 300,
                    rows: 3,
                    wide: true,
                },
                {
                    name: "callAction",
                    label: "Call Card Action",
                    maxLength: 60,
                },
                {
                    name: "emailDescription",
                    label: "Email Card Description",
                    maxLength: 300,
                    rows: 3,
                    wide: true,
                },
                {
                    name: "emailAction",
                    label: "Email Card Action",
                    maxLength: 60,
                },
                {
                    name: "visitDescriptionBeforeCity",
                    label: "Visit Description Before City",
                    maxLength: 150,
                },
                {
                    name: "visitDescriptionAfterCity",
                    label: "Visit Description After City",
                    maxLength: 250,
                    rows: 3,
                    wide: true,
                },
                {
                    name: "visitAction",
                    label: "Visit Card Action",
                    maxLength: 60,
                },
            ],
        },

        {
            id: "message",

            eyebrow: "Contact Page Message",

            title: "Send a Message",

            description:
                "Edit the introduction, callout, and accepted inquiry topics.",

            note:
                "The Formspree contact form, its fields, validation, and same-day notices remain protected.",

            fields: [
                {
                    name: "subtitle",
                    label: "Subtitle",
                    maxLength: 80,
                },
                {
                    name: "title",
                    label: "Section Heading",
                    maxLength: 120,
                },
                {
                    name: "description",
                    label: "Instructions",
                    maxLength: 500,
                    rows: 4,
                    wide: true,
                },
                {
                    name: "fastAnswerTitle",
                    label: "Callout Heading",
                    maxLength: 100,
                },
                {
                    name: "inquiryHeading",
                    label: "Inquiry List Heading",
                    maxLength: 100,
                },
                {
                    name: "inquiry1",
                    label: "Inquiry Topic 1",
                    maxLength: 100,
                },
                {
                    name: "inquiry2",
                    label: "Inquiry Topic 2",
                    maxLength: 100,
                },
                {
                    name: "inquiry3",
                    label: "Inquiry Topic 3",
                    maxLength: 100,
                },
                {
                    name: "inquiry4",
                    label: "Inquiry Topic 4",
                    maxLength: 100,
                },
                {
                    name: "inquiry5",
                    label: "Inquiry Topic 5",
                    maxLength: 100,
                },
            ],
        },

        {
            id: "location",

            eyebrow: "Contact Page Location",

            title: "Location & Hours",

            description:
                "Edit the wording around the restaurant map and weekly schedule.",

            note:
                "The map, street address, phone, email, and opening hours continue to come from Site Settings.",

            fields: [
                {
                    name: "subtitle",
                    label: "Subtitle",
                    maxLength: 100,
                },
                {
                    name: "titlePrefix",
                    label: "Heading Before City",
                    maxLength: 100,
                    help:
                        "The current restaurant city is inserted automatically.",
                },
                {
                    name: "directionsButtonText",
                    label: "Directions Button Text",
                    maxLength: 60,
                },
            ],
        },
    ];

/*-----------------------------------*\
  #LOAD CONTACT PAGE CONTENT
\*-----------------------------------*/

export const getContactPageContent = cache(
    async (): Promise<ContactPageContent> => {
        const supabase =
            getPublicSupabaseClient();

        if (!supabase) {
            return DEFAULT_CONTACT_PAGE_CONTENT;
        }

        const { data, error } = await supabase
            .from("contact_page_content")
            .select("content")
            .eq("id", 1)
            .maybeSingle();

        if (error) {
            console.error(
                "Unable to load Contact Page content:",
                error,
            );

            return DEFAULT_CONTACT_PAGE_CONTENT;
        }

        const saved =
            (data?.content ?? {}) as
                Partial<ContactPageContent>;

        return {
            hero: {
                ...DEFAULT_CONTACT_PAGE_CONTENT.hero,
                ...saved.hero,
            },

            options: {
                ...DEFAULT_CONTACT_PAGE_CONTENT.options,
                ...saved.options,
            },

            message: {
                ...DEFAULT_CONTACT_PAGE_CONTENT.message,
                ...saved.message,
            },

            location: {
                ...DEFAULT_CONTACT_PAGE_CONTENT.location,
                ...saved.location,
            },
        };
    },
);
