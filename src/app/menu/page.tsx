import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuClient from "./MenuClient";
import { getRestaurantContactInfo } from "@/lib/restaurant-contact";
import { getRestaurantNotices } from "@/lib/restaurant-notices";

import {
  getPublicRestaurantMenuData,
} from "@/lib/restaurant-menu";

import {
  getMenuPageContent,
} from "@/lib/menu-page-content";

export default async function MenuPage() {
  const [
    contactInfo,
    customerNotices,
    restaurantMenu,
    menuPageContent,
  ] = await Promise.all([
    getRestaurantContactInfo(),
    getRestaurantNotices(),
    getPublicRestaurantMenuData(),
    getMenuPageContent(),
  ]);

  const {
    phone,
    phoneHref,
  } = contactInfo;

  const onlineOrderingNotice =
    customerNotices.find(
      (notice) =>
        notice.key === "online-ordering-notice",
    ) ?? null;

  return (
    <>
      <Header />

      <MenuClient
        phone={phone}
        phoneHref={phoneHref}
        onlineOrderingNotice={
          onlineOrderingNotice
        }
        menuCategories={
          restaurantMenu.categories
        }
        menuItems={
          restaurantMenu.items
        }
        menuOptionGroups={
          restaurantMenu.optionGroups
        }
        menuItemOptionGroups={
          restaurantMenu.itemOptionGroups
        }
        menuPageContent={
          menuPageContent
        }
      />

      <Footer />
    </>
  );
}