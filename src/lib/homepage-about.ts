import { cache } from "react";

import {
    MEDIA_BUCKET,
} from "@/lib/media-constants";

import {
    getPublicSupabaseClient,
} from "@/lib/supabase-public";

export type HomepageAboutContent = {
    subtitle: string;
    title: string;
    description: string;
    buttonText: string;

    mainImagePath: string;
    mainImageAlt: string;

    insetImagePath: string;
    insetImageAlt: string;
};

type HomepageAboutRow = {
    subtitle: string;
    title: string;
    description: string;
    button_text: string;

    main_image_path: string | null;
    inset_image_path: string | null;
};

type MediaAltRow = {
    storage_path: string;
    alt_text: string;
};

export const DEFAULT_HOMEPAGE_ABOUT:
    HomepageAboutContent = {
    subtitle: "Our Story",

    title:
        "Every Plate Tells a Story",

    description:
        "Ronnie's Q is built around fresh flavor, family service, and the kind of food people come back for. Whether you are stopping in for a meal, planning a gathering, or looking ahead to future catering, our goal is to make every visit feel welcoming.",

    buttonText:
        "Contact Us",

    mainImagePath:
        "/images/about-banner.png",

    mainImageAlt:
        "Ronnie's Q restaurant food",

    insetImagePath:
        "/images/about-abs-image.png",

    insetImageAlt:
        "Fresh food closeup",
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

export const getHomepageAboutContent =
    cache(
        async (): Promise<HomepageAboutContent> => {
            const supabase =
                getPublicSupabaseClient();

            if (!supabase) {
                return DEFAULT_HOMEPAGE_ABOUT;
            }

            const supabaseClient = supabase;

            const {
                data,
                error,
            } = await supabase
                .from(
                    "homepage_about_section",
                )
                .select(
                    `
                        subtitle,
                        title,
                        description,
                        button_text,
                        main_image_path,
                        inset_image_path
                    `,
                )
                .eq("id", 1)
                .maybeSingle();

            if (
                error ||
                !data
            ) {
                if (error) {
                    console.error(
                        "Unable to load homepage About section:",
                        error,
                    );
                }

                return DEFAULT_HOMEPAGE_ABOUT;
            }

            const row =
                data as HomepageAboutRow;

            const mainImageStoragePath =
                row.main_image_path?.trim() ||
                DEFAULT_HOMEPAGE_ABOUT
                    .mainImagePath;

            const insetImageStoragePath =
                row.inset_image_path?.trim() ||
                DEFAULT_HOMEPAGE_ABOUT
                    .insetImagePath;

            const mediaStoragePaths = [
                mainImageStoragePath,
                insetImageStoragePath,
            ].filter(
                (path) =>
                    !isLocalOrFullUrl(path),
            );

            const altTextByPath =
                new Map<string, string>();

            if (
                mediaStoragePaths.length >
                0
            ) {
                const {
                    data: mediaRows,
                    error: mediaError,
                } = await supabase
                    .from("media_assets")
                    .select(
                        "storage_path, alt_text",
                    )
                    .in(
                        "storage_path",
                        mediaStoragePaths,
                    );

                if (mediaError) {
                    console.error(
                        "Unable to load homepage About image alt text:",
                        mediaError,
                    );
                } else {
                    (
                        (mediaRows ?? []) as
                        MediaAltRow[]
                    ).forEach(
                        (mediaRow) => {
                            altTextByPath.set(
                                mediaRow.storage_path,
                                mediaRow.alt_text,
                            );
                        },
                    );
                }
            }

            function resolveImagePath(
                path: string,
            ): string {
                if (
                    isLocalOrFullUrl(
                        path,
                    )
                ) {
                    return path;
                }

                const {
                    data:
                    publicUrlData,
                } =
                    supabaseClient.storage
                        .from(
                            MEDIA_BUCKET,
                        )
                        .getPublicUrl(
                            path,
                        );

                return (
                    publicUrlData.publicUrl
                );
            }

            return {
                subtitle:
                    row.subtitle ||
                    DEFAULT_HOMEPAGE_ABOUT
                        .subtitle,

                title:
                    row.title ||
                    DEFAULT_HOMEPAGE_ABOUT
                        .title,

                description:
                    row.description ||
                    DEFAULT_HOMEPAGE_ABOUT
                        .description,

                buttonText:
                    row.button_text ||
                    DEFAULT_HOMEPAGE_ABOUT
                        .buttonText,

                mainImagePath:
                    resolveImagePath(
                        mainImageStoragePath,
                    ),

                mainImageAlt:
                    altTextByPath.get(
                        mainImageStoragePath,
                    ) ||
                    DEFAULT_HOMEPAGE_ABOUT
                        .mainImageAlt,

                insetImagePath:
                    resolveImagePath(
                        insetImageStoragePath,
                    ),

                insetImageAlt:
                    altTextByPath.get(
                        insetImageStoragePath,
                    ) ||
                    DEFAULT_HOMEPAGE_ABOUT
                        .insetImageAlt,
            };
        },
    );