import { cache } from "react";

import {
  getPublicSupabaseClient,
} from "@/lib/supabase-public";

import {
  MEDIA_BUCKET,
} from "@/lib/media-constants";

export type HomepageServiceCard = {
  cardNumber: number;
  title: string;
  buttonText: string;
  imagePath: string;
  imageAlt: string;
  href: string;
};

export type HomepageServicesContent = {
  subtitle: string;
  title: string;
  description: string;
  cards: HomepageServiceCard[];
};

type ServicesSectionRow = {
  subtitle: string;
  title: string;
  description: string;
};

type ServiceCardRow = {
  card_number: number;
  title: string;
  button_text: string;
  image_path: string | null;
};

type MediaAltRow = {
  storage_path: string;
  alt_text: string;
};

const DEFAULT_SERVICES_SECTION = {
  subtitle:
    "Ronnie's Q Favorites",

  title:
    "We Offer Fresh Flavor",

  description:
    "From comfort food favorites to family-style plates, Ronnie's Q serves food made for everyday meals, gatherings, and local customers who want something satisfying.",
};

export const DEFAULT_SERVICE_CARDS:
  HomepageServiceCard[] = [
    {
      cardNumber: 1,
      title: "Lunch Plates",
      buttonText: "View Menu",
      imagePath:
        "/images/service-1.png",
      imageAlt:
        "Lunch plates",
      href: "/menu",
    },

    {
      cardNumber: 2,
      title:
        "Dinner Favorites",
      buttonText:
        "View Menu",
      imagePath:
        "/images/service-2.png",
      imageAlt:
        "Dinner favorites",
      href: "/menu",
    },

    {
      cardNumber: 3,
      title:
        "Catering",
      buttonText:
        "Contact Us",
      imagePath:
        "/images/service-3.png",
      imageAlt:
        "Catering",
      href: "/contact",
    },
  ];

function resolveImagePath(
  imagePath: string,
  supabase: NonNullable<
    ReturnType<
      typeof getPublicSupabaseClient
    >
  >,
): string {
  if (
    imagePath.startsWith("/")
  ) {
    return imagePath;
  }

  if (
    imagePath.startsWith(
      "https://",
    ) ||
    imagePath.startsWith(
      "http://",
    )
  ) {
    return imagePath;
  }

  const {
    data,
  } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(
      imagePath,
    );

  return data.publicUrl;
}

export const getHomepageServicesContent =
  cache(
    async (): Promise<
      HomepageServicesContent
    > => {
      const supabase =
        getPublicSupabaseClient();

      if (!supabase) {
        return {
          ...DEFAULT_SERVICES_SECTION,
          cards:
            DEFAULT_SERVICE_CARDS,
        };
      }

      const [
        sectionResponse,
        cardsResponse,
      ] = await Promise.all([
        supabase
          .from(
            "homepage_services_section",
          )
          .select(
            `
              subtitle,
              title,
              description
            `,
          )
          .eq("id", 1)
          .maybeSingle(),

        supabase
          .from(
            "homepage_service_cards",
          )
          .select(
            `
              card_number,
              title,
              button_text,
              image_path
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
        sectionResponse.error
      ) {
        console.error(
          "Unable to load homepage Services section:",
          sectionResponse.error,
        );
      }

      if (
        cardsResponse.error
      ) {
        console.error(
          "Unable to load homepage Services cards:",
          cardsResponse.error,
        );
      }

      const section =
        sectionResponse.data as
          | ServicesSectionRow
          | null;

      const databaseCards =
        (cardsResponse.data ??
          []) as ServiceCardRow[];

      const cardsByNumber =
        new Map(
          databaseCards.map(
            (card) => [
              card.card_number,
              card,
            ],
          ),
        );

      const mergedCards =
        DEFAULT_SERVICE_CARDS.map(
          (fallback) => {
            const row =
              cardsByNumber.get(
                fallback.cardNumber,
              );

            const storedImagePath =
              row?.image_path
                ?.trim() ||
              fallback.imagePath;

            return {
              ...fallback,

              title:
                row?.title ||
                fallback.title,

              buttonText:
                row?.button_text ||
                fallback.buttonText,

              imagePath:
                storedImagePath,
            };
          },
        );

      const storagePaths =
        mergedCards
          .map(
            (card) =>
              card.imagePath,
          )
          .filter(
            (imagePath) =>
              !imagePath.startsWith(
                "/",
              ) &&
              !/^https?:\/\//i.test(
                imagePath,
              ),
          );

      let altTextByPath =
        new Map<
          string,
          string
        >();

      if (
        storagePaths.length >
        0
      ) {
        const {
          data: mediaRows,
          error:
            mediaRowsError,
        } = await supabase
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

        if (
          mediaRowsError
        ) {
          console.error(
            "Unable to load Services image alt text:",
            mediaRowsError,
          );
        } else {
          altTextByPath =
            new Map(
              (
                (mediaRows ??
                  []) as MediaAltRow[]
              ).map(
                (row) => [
                  row.storage_path,
                  row.alt_text,
                ],
              ),
            );
        }
      }

      return {
        subtitle:
          section?.subtitle ||
          DEFAULT_SERVICES_SECTION.subtitle,

        title:
          section?.title ||
          DEFAULT_SERVICES_SECTION.title,

        description:
          section?.description ||
          DEFAULT_SERVICES_SECTION.description,

        cards:
          mergedCards.map(
            (card) => ({
              ...card,

              imageAlt:
                altTextByPath.get(
                  card.imagePath,
                ) ||
                card.imageAlt ||
                card.title,

              imagePath:
                resolveImagePath(
                  card.imagePath,
                  supabase,
                ),
            }),
          ),
      };
    },
  );