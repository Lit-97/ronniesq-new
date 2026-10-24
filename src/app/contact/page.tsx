import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteScripts from "@/components/SiteScripts";
import OrderModalController from "@/components/OrderModalController";
import { getHeaderHours } from "@/lib/restaurant-hours";
import { getRestaurantContactInfo } from "@/lib/restaurant-contact";
import { getRestaurantLocationInfo } from "@/lib/restaurant-location";
import { getRestaurantNotices } from "@/lib/restaurant-notices";
import ContactForm from "./ContactForm";
import "./contact.css";

export const metadata: Metadata = {
    title: "Contact Us | Ronnie's Q",
    description:
        "Contact Ronnie's Q in Dickson, Tennessee about orders, catering, menu questions, restaurant hours, and general inquiries.",
};


function formatContactTime(
    value: string | null,
): string {
    if (!value) {
        return "";
    }

    const [hourText, minuteText = "00"] =
        value.split(":");

    const hour = Number(hourText);

    if (!Number.isFinite(hour)) {
        return value;
    }

    const suffix = hour >= 12 ? "pm" : "am";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minuteText} ${suffix}`;
}

export default async function ContactPage() {
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

    const {
        weeklyDays,
        hasTodayOverride,
        specialDateLabel,
        dayName,
        isOpen,
        hoursText,
        customerMessage,
    } = restaurantHours;

    const {
        phone,
        phoneHref,
        email,
    } = contactInfo;

    const {
        streetAddress,
        city,
        stateCode,
        postalCode,
        cityState,
        fullAddress,
        mapUrl,
        mapEmbedUrl,
    } = locationInfo;

    const sameDayOrderNotice =
        customerNotices.find(
            (notice) =>
                notice.key === "same-day-order-notice",
        ) ?? null;

    return (
        <>
            <Header />

            <main id="top" className="contact-page">
                {/* HERO */}
                <section
                    className="contact-page-hero"
                    aria-labelledby="contact-page-title"
                >
                    <div className="contact-page-hero-glow" aria-hidden="true"></div>
                    <div className="contact-page-embers" aria-hidden="true"></div>

                    <div className="container contact-page-hero-center">
                        <div className="contact-page-hero-eyebrow-row">
                            <span>Ronnie&apos;s Q</span>
                            <span className="contact-page-hero-eyebrow-dot" aria-hidden="true"></span>
                            <span>{cityState}</span>
                        </div>

                        <p className="section-subtitle label-2">Get in Touch</p>

                        <h1 id="contact-page-title" className="contact-page-hero-title">
                            Let&apos;s Talk
                            <span>Barbecue.</span>
                        </h1>

                        <p className="contact-page-hero-text">
                            Have a question about the menu, catering, a large order, or
                            visiting Ronnie&apos;s Q? Give us a call or send us a message.
                        </p>

                        <div className="contact-page-hero-actions">
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

                            <Link href="/menu" className="contact-page-text-link">
                                View Our Menu
                            </Link>
                        </div>

                        <div className="contact-page-hero-banner">
                            <span className="contact-page-hero-banner-kicker">
                                Slow-Smoked • Southern-Made
                            </span>

                            <h2>Come Hungry.</h2>

                            <p>
                                Slow-smoked barbecue, Southern sides, and hometown service in
                                the heart of {city}.
                            </p>
                        </div>

                        <div className="contact-page-hero-contact-grid">
                            <a
                                href={phoneHref}
                                className="contact-page-hero-contact-item"
                            >
                                <ion-icon
                                    name="call-outline"
                                    aria-hidden="true"
                                ></ion-icon>

                                <div>
                                    <span>Call Us</span>
                                    <strong>{phone}</strong>
                                </div>
                            </a>

                            <a
                                href={mapUrl}
                                className="contact-page-hero-contact-item"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ion-icon
                                    name="location-outline"
                                    aria-hidden="true"
                                ></ion-icon>

                                <div>
                                    <span>Visit Us</span>
                                    <strong>
                                        {streetAddress}, {cityState}
                                    </strong>
                                </div>
                            </a>

                            <div className="contact-page-hero-contact-item">
                                <ion-icon
                                    name="time-outline"
                                    aria-hidden="true"
                                ></ion-icon>

                                <div>
                                    <span>Today&apos;s Hours</span>

                                    <strong className="contact-page-hero-today-hours-inline">
                                        {dayName}:{" "}
                                        {isOpen
                                            ? hoursText.replace(
                                                " to ",
                                                " – ",
                                            )
                                            : "Closed"}
                                    </strong>
                                </div>
                            </div>

                            <a
                                href={mapUrl}
                                className="contact-page-hero-directions"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Get Directions
                                <ion-icon name="arrow-forward-outline" aria-hidden="true"></ion-icon>
                            </a>
                        </div>
                    </div>
                </section>
                {/* QUICK CONTACT CARDS */}
                <section
                    className="contact-page-options"
                    aria-labelledby="contact-options-title"
                >
                    <div className="container">
                        <div className="contact-page-section-heading">
                            <p className="section-subtitle label-2">Contact Options</p>

                            <h2
                                id="contact-options-title"
                                className="contact-page-section-title"
                            >
                                Reach Ronnie&apos;s Q Your Way
                            </h2>

                            <p>
                                Calling is the fastest way to ask about today&apos;s menu,
                                specials, availability, or a same-day order.
                            </p>
                        </div>

                        <div className="contact-page-card-grid">
                            <a
                                href={phoneHref}
                                className="contact-page-option-card"
                            >
                                <div className="contact-page-option-icon">
                                    <ion-icon name="call-outline" aria-hidden="true"></ion-icon>
                                </div>

                                <span className="contact-page-card-number">01</span>

                                <h3>Call Us</h3>

                                <strong>{phone}</strong>

                                <p>
                                    Call during restaurant hours for orders, menu questions, and
                                    faster assistance.
                                </p>

                                <span className="contact-page-card-action">
                                    Call Ronnie&apos;s Q
                                </span>
                            </a>

                            <a
                                href={`mailto:${email}`}
                                className="contact-page-option-card"
                            >
                                <div className="contact-page-option-icon">
                                    <ion-icon name="mail-outline" aria-hidden="true"></ion-icon>
                                </div>

                                <span className="contact-page-card-number">02</span>

                                <h3>Email Us</h3>

                                <strong>{email}</strong>

                                <p>
                                    Email us about catering, future events, business questions,
                                    and other non-urgent requests.
                                </p>

                                <span className="contact-page-card-action">Send an Email</span>
                            </a>

                            <a
                                href={mapUrl}
                                className="contact-page-option-card"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="contact-page-option-icon">
                                    <ion-icon
                                        name="location-outline"
                                        aria-hidden="true"
                                    ></ion-icon>
                                </div>

                                <span className="contact-page-card-number">03</span>

                                <h3>Visit Us</h3>

                                <strong>{streetAddress}</strong>

                                <p>
                                    Find us in {cityState} for dine-in service, takeout,
                                    and Southern barbecue.
                                </p>

                                <span className="contact-page-card-action">
                                    Open Google Maps
                                </span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* MESSAGE FORM */}
                <section
                    className="contact-page-message-section"
                    aria-labelledby="message-title"
                >
                    <div className="container contact-page-message-layout">
                        <div className="contact-page-message-intro">
                            <p className="section-subtitle label-2">Send a Message</p>

                            <h2 id="message-title" className="contact-page-section-title">
                                How Can We Help?
                            </h2>

                            <div className="contact-page-gold-line"></div>

                            <p>
                                Tell us what you are contacting us about and include any
                                helpful details. For same-day orders or urgent questions,
                                please call the restaurant instead.
                            </p>

                            <div className="contact-page-call-notice">
                                <ion-icon name="call-outline" aria-hidden="true"></ion-icon>

                                <div>
                                    <span>Need a faster answer?</span>

                                    <a href={phoneHref}>
                                        Call {phone}
                                    </a>
                                </div>
                            </div>

                            <div className="contact-page-inquiry-list">
                                <h3>Contact us about:</h3>

                                <ul>
                                    <li>
                                        <ion-icon
                                            name="checkmark-outline"
                                            aria-hidden="true"
                                        ></ion-icon>
                                        Menu or order questions
                                    </li>

                                    <li>
                                        <ion-icon
                                            name="checkmark-outline"
                                            aria-hidden="true"
                                        ></ion-icon>
                                        Catering requests
                                    </li>

                                    <li>
                                        <ion-icon
                                            name="checkmark-outline"
                                            aria-hidden="true"
                                        ></ion-icon>
                                        Events and large orders
                                    </li>

                                    <li>
                                        <ion-icon
                                            name="checkmark-outline"
                                            aria-hidden="true"
                                        ></ion-icon>
                                        Restaurant feedback
                                    </li>

                                    <li>
                                        <ion-icon
                                            name="checkmark-outline"
                                            aria-hidden="true"
                                        ></ion-icon>
                                        General questions
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <ContactForm
                            sameDayOrderNotice={sameDayOrderNotice}
                        />
                    </div>
                </section>

                {/* LOCATION AND HOURS */}
                <section
                    className="contact-page-location-section"
                    aria-labelledby="visit-title"
                >
                    <div className="container">
                        <div className="contact-page-location-layout">
                            <div className="contact-page-map">
                                <iframe
                                    title={`Map showing Ronnie's Q at ${fullAddress}`}
                                    src={mapEmbedUrl}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>

                            <div className="contact-page-location-content">
                                <p className="section-subtitle label-2">Visit Ronnie&apos;s Q</p>

                                <h2 id="visit-title" className="contact-page-section-title">
                                    Find Us in {city}
                                </h2>

                                <div className="contact-page-gold-line"></div>

                                <div className="contact-page-location-row">
                                    <span>Address</span>

                                    <address>
                                        {streetAddress}
                                        <br />
                                        {city}, {stateCode} {postalCode}
                                    </address>
                                </div>

                                <div className="contact-page-location-row">
                                    <span>Phone</span>

                                    <a href={phoneHref}>
                                        {phone}
                                    </a>
                                </div>

                                <div className="contact-page-location-row">
                                    <span>Email</span>

                                    <a href={`mailto:${email}`}>
                                        {email}
                                    </a>
                                </div>

                                <div className="contact-page-hours">
                                    {hasTodayOverride && (
                                        <div className="contact-page-special-hours">
                                            <p className="contact-page-special-hours-label">
                                                Current Special Hours
                                            </p>

                                            <div className="contact-page-special-hours-schedule">
                                                <span>
                                                    {specialDateLabel ?? "Today"}
                                                </span>

                                                <strong
                                                    className={
                                                        isOpen
                                                            ? undefined
                                                            : "contact-page-closed"
                                                    }
                                                >
                                                    {isOpen
                                                        ? hoursText.replace(
                                                            " to ",
                                                            " – ",
                                                        )
                                                        : "Closed"}
                                                </strong>
                                            </div>

                                            {customerMessage && (
                                                <small>
                                                    {customerMessage}
                                                </small>
                                            )}
                                        </div>
                                    )}

                                    {hasTodayOverride && (
                                        <p className="contact-page-regular-hours-label">
                                            Regular Weekly Hours
                                        </p>
                                    )}

                                    {weeklyDays.map((day) => (
                                        <div
                                            className="contact-page-hours-row"
                                            key={day.dayOfWeek}
                                        >
                                            <span>{day.dayName}</span>

                                            <strong
                                                className={
                                                    day.isOpen
                                                        ? undefined
                                                        : "contact-page-closed"
                                                }
                                            >
                                                {day.isOpen &&
                                                    day.opensAt &&
                                                    day.closesAt
                                                    ? `${formatContactTime(
                                                        day.opensAt,
                                                    )} – ${formatContactTime(
                                                        day.closesAt,
                                                    )}`
                                                    : "Closed"}
                                            </strong>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href={mapUrl}
                                    className="btn btn-secondary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="text text-1">Get Directions</span>

                                    <span className="text text-2" aria-hidden="true">
                                        Get Directions
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />

            {/* EXISTING SCROLLER */}
            <a
                href="#top"
                className="back-top-btn"
                aria-label="back to top"
                data-back-top-btn
            >
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

            <OrderModalController phoneHref={phoneHref} />
            <SiteScripts />
        </>
    );
}