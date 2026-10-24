export const MEDIA_BUCKET =
  "restaurant-media";

export const MEDIA_CATEGORIES = [
  "homepage",
  "menu",
  "branding",
  "general",
] as const;

export type MediaCategory =
  (typeof MEDIA_CATEGORIES)[number];

export const MEDIA_CATEGORY_LABELS: Record<
  MediaCategory,
  string
> = {
  homepage: "Homepage",
  menu: "Menu",
  branding: "Branding",
  general: "General",
};

export const ALLOWED_MEDIA_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_MEDIA_SIZE_BYTES =
  6 * 1024 * 1024;