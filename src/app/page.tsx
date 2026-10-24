import About from "@/components/About";
import ContactReservation from "@/components/ContactReservation";
import Articles from "@/components/Articles";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Services from "@/components/Services";
import SiteScripts from "@/components/SiteScripts";
import SpecialDish from "@/components/SpecialDish";
import Testimonials from "@/components/Testimonials";
import OrderModalController from "@/components/OrderModalController";
import { getHeaderHours } from "@/lib/restaurant-hours";
import { getRestaurantContactInfo } from "@/lib/restaurant-contact";
import { getRestaurantLocationInfo } from "@/lib/restaurant-location";
import { getRestaurantNotices } from "@/lib/restaurant-notices";

export default async function Home() {
  const [
    restaurantHours,
    contactInfo,
    locationInfo,
    customerNotices,
  ] = await Promise.all([
    getHeaderHours(),
    getRestaurantContactInfo(),
    getRestaurantLocationInfo(),
    getRestaurantNotices(),
  ]);

  const sameDayOrderNotice =
    customerNotices.find(
      (notice) =>
        notice.key === "same-day-order-notice",
    ) ?? null;

  const onlineOrderingNotice =
    customerNotices.find(
      (notice) =>
        notice.key === "online-ordering-notice",
    ) ?? null;

  return (
    <>
      <Header />

      <main>
        <article>
          <Hero />
          <Services />
          <About />
          <SpecialDish />
          <Menu />
          <Testimonials />
          <ContactReservation
            weeklyScheduleLines={
              restaurantHours.weeklyScheduleLines
            }
            todaySpecialHours={
              restaurantHours.hasTodayOverride
                ? {
                  dateLabel:
                    restaurantHours.specialDateLabel ??
                    restaurantHours.dayName,

                  isOpen: restaurantHours.isOpen,
                  hoursText: restaurantHours.hoursText,

                  message:
                    restaurantHours.customerMessage,
                }

                : null
            }
            phone={contactInfo.phone}
            phoneHref={contactInfo.phoneHref}
            fullAddress={locationInfo.fullAddress}
            sameDayOrderNotice={sameDayOrderNotice}
            onlineOrderingNotice={onlineOrderingNotice}
          />
          <Features />
          <Articles />
        </article>
      </main>

      <Footer />

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

      <OrderModalController
        phoneHref={contactInfo.phoneHref}
      />

      <SiteScripts />
    </>
  );
}