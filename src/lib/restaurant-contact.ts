import { getPublicSupabaseClient } from "@/lib/supabase-public";

export type RestaurantContactInfo = {
  phone: string;
  phoneHref: string;
  email: string;
  source: "supabase" | "fallback";
};

const DEFAULT_RESTAURANT_CONTACT = {
  phone: "615-441-0012",
  email: "primmronnie@gmail.com",
};

function buildPhoneHref(
  phone: string,
): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `tel:+1${digits}`;
  }

  if (
    digits.length === 11 &&
    digits.startsWith("1")
  ) {
    return `tel:+${digits}`;
  }

  return `tel:${phone.replace(/\s/g, "")}`;
}

export async function getRestaurantContactInfo(): Promise<RestaurantContactInfo> {
  const supabase = getPublicSupabaseClient();

  if (!supabase) {
    return {
      ...DEFAULT_RESTAURANT_CONTACT,
      phoneHref: buildPhoneHref(
        DEFAULT_RESTAURANT_CONTACT.phone,
      ),
      source: "fallback",
    };
  }

  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("phone, email")
    .eq("id", 1)
    .maybeSingle();

  if (
    error ||
    !data?.phone ||
    !data?.email
  ) {
    if (error) {
      console.error(
        "Unable to load restaurant contact information:",
        error,
      );
    }

    return {
      ...DEFAULT_RESTAURANT_CONTACT,
      phoneHref: buildPhoneHref(
        DEFAULT_RESTAURANT_CONTACT.phone,
      ),
      source: "fallback",
    };
  }

  return {
    phone: data.phone,
    phoneHref: buildPhoneHref(data.phone),
    email: data.email,
    source: "supabase",
  };
}