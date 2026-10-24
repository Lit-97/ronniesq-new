import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteScripts from "@/components/SiteScripts";
import OrderModalController from "@/components/OrderModalController";
import { getHeaderHours } from "@/lib/restaurant-hours";
import { getRestaurantContactInfo } from "@/lib/restaurant-contact";
import { getRestaurantLocationInfo } from "@/lib/restaurant-location";
import { getAboutPageContent } from "@/lib/about-page-content";
import AboutReveal from "./AboutReveal";
import AboutMemoryGallery from "./AboutMemoryGallery";
import "./about.css";

export const metadata = {
    title: "About Us | Ronnie's Q",
    description:
        "Learn the story behind Ronnie's Q, a family barbecue restaurant in Dickson, Tennessee.",
};

export default async function AboutPage() {
    const [
        restaurantHours,
        contactInfo,
        locationInfo,
        aboutContent,
    ] = await Promise.all([
        getHeaderHours(),
        getRestaurantContactInfo(),
        getRestaurantLocationInfo(),
        getAboutPageContent(),
    ]);

    const { weeklyScheduleLines } =
        restaurantHours;

    const {
        phoneHref,
    } = contactInfo;

    const {
        city,
        cityState,
        fullAddress,
        mapUrl,
    } = locationInfo;

    return (
        <>
            <Header />

            <main id="top" className="about-page">
                <AboutReveal />

                <section className="about-cinematic-hero" aria-labelledby="about-title">
                    <div className="about-smoke smoke-1"></div>
                    <div className="about-smoke smoke-2"></div>
                    <div className="about-ember-field" aria-hidden="true"></div>

                    <div className="about-hero-inner about-hero-plaque" data-about-reveal>
                        <div className="about-hero-topline">
                            <span>
                                {aboutContent.hero.eyebrow}
                            </span>

                            <span>
                                Ronnie&apos;s Q
                            </span>
                        </div>

                        <h1
                            id="about-title"
                            className="about-hero-title"
                        >
                            {aboutContent.hero.titleLine1}

                            <span>
                                {aboutContent.hero.titleLine2}
                            </span>
                        </h1>

                        <p className="about-hero-copy">
                            {aboutContent.hero.descriptionBeforeCity}{" "}
                            {city}.
                        </p>

                        <div className="about-hero-meta">
                            <span>
                                {aboutContent.hero.meta1}
                            </span>

                            <span>
                                {aboutContent.hero.meta2}
                            </span>

                            <span>
                                {cityState}
                            </span>
                        </div>

                        <div className="about-hero-actions">
                            <Link
                                href="/menu"
                                className="btn btn-secondary"
                            >
                                <span className="text text-1">
                                    {aboutContent.hero.menuButtonText}
                                </span>

                                <span
                                    className="text text-2"
                                    aria-hidden="true"
                                >
                                    {aboutContent.hero.menuButtonText}
                                </span>
                            </Link>

                            <a
                                href={phoneHref}
                                className="about-hero-call"
                            >
                                {aboutContent.hero.callButtonText}
                            </a>
                        </div>
                    </div>

                    <div
                        className="about-hero-photo-wrap"
                        data-about-reveal
                    >
                        <img
                            src={
                                aboutContent.hero.image.imagePath
                            }
                            alt={
                                aboutContent.hero.image.imageAlt
                            }
                            className="about-hero-photo"
                        />

                        <div className="about-hero-photo-label">
                            <span>
                                Ronnie&apos;s Q
                            </span>

                            <strong>
                                {aboutContent.hero.photoCaption}
                            </strong>
                        </div>
                    </div>
                </section>

                <section className="about-story-section">
                    <div className="container">
                        <div className="about-story-grid">
                            <article className="about-story-card" data-about-reveal>
                                <p className="section-subtitle label-2">
                                    {aboutContent.story.subtitle}
                                </p>

                                <h2 className="about-section-title">
                                    {aboutContent.story.title}
                                </h2>

                                <div className="about-gold-line"></div>

                                <p>
                                    {aboutContent.story.paragraph1BeforeCity}{" "}
                                    {city}
                                    {aboutContent.story.paragraph1AfterCity}
                                </p>

                                <p>
                                    {aboutContent.story.paragraph2}
                                </p>

                                <div className="about-story-hours">
                                    {weeklyScheduleLines.map((line) => (
                                        <div
                                            className="about-story-hours-row"
                                            key={`${line.dayLabel}-${line.hoursText}`}
                                        >
                                            <span>
                                                Open {line.dayLabel}
                                            </span>

                                            <strong>
                                                {line.hoursText}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <div className="about-photo-collage about-award-collage" data-about-reveal>
                                <div className="about-award-smoke" aria-hidden="true">
                                    <video
                                        className="about-smoke-video smoke-video-main"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="auto"
                                    >
                                        <source src="/images/about/smoke-overlay.webm" type="video/webm" />
                                    </video>


                                </div>

                                <figure className="about-award-image about-smoker-back-card">
                                    <img
                                        src={
                                            aboutContent.story
                                                .smokerImage
                                                .imagePath
                                        }
                                        alt={
                                            aboutContent.story
                                                .smokerImage
                                                .imageAlt
                                        }
                                    />
                                </figure>

                                <figure className="about-award-image about-main-award-plaque">
                                    <img
                                        src={
                                            aboutContent.story
                                                .mainAwardImage
                                                .imagePath
                                        }
                                        alt={
                                            aboutContent.story
                                                .mainAwardImage
                                                .imageAlt
                                        }
                                    />
                                </figure>

                                <figure className="about-award-image about-dickson-award-plaque">
                                    <img
                                        src={
                                            aboutContent.story
                                                .dicksonAwardImage
                                                .imagePath
                                        }
                                        alt={
                                            aboutContent.story
                                                .dicksonAwardImage
                                                .imageAlt
                                        }
                                    />
                                </figure>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-origin-section">
                    <div className="container">
                        <div
                            className="about-origin-header"
                            data-about-reveal
                        >
                            <p className="section-subtitle label-2">
                                {aboutContent.history.subtitle}
                            </p>

                            <h2 className="about-section-title">
                                {aboutContent.history.title}
                            </h2>

                            <p className="about-origin-subtext">
                                {aboutContent.history.intro}
                            </p>
                        </div>

                        <div className="about-origin-layout">
                            <article
                                className="about-origin-card"
                                data-about-reveal
                            >
                                <span className="about-origin-number">
                                    01
                                </span>

                                <h3>
                                    {
                                        aboutContent.history
                                            .cards[0].title
                                    }
                                </h3>

                                <p>
                                    {
                                        aboutContent.history
                                            .cards[0].description
                                    }
                                </p>
                            </article>

                            <figure
                                className="about-origin-image"
                                data-about-reveal
                            >
                                <img
                                    src={
                                        aboutContent.history
                                            .cards[0]
                                            .image
                                            .imagePath
                                    }
                                    alt={
                                        aboutContent.history
                                            .cards[0]
                                            .image
                                            .imageAlt
                                    }
                                />
                            </figure>

                            <figure
                                className="about-origin-image"
                                data-about-reveal
                            >
                                <img
                                    src={
                                        aboutContent.history
                                            .cards[1]
                                            .image
                                            .imagePath
                                    }
                                    alt={
                                        aboutContent.history
                                            .cards[1]
                                            .image
                                            .imageAlt
                                    }
                                />
                            </figure>

                            <article
                                className="about-origin-card"
                                data-about-reveal
                            >
                                <span className="about-origin-number">
                                    02
                                </span>

                                <h3>
                                    {
                                        aboutContent.history
                                            .cards[1].title
                                    }
                                </h3>

                                <p>
                                    {
                                        aboutContent.history
                                            .cards[1].description
                                    }
                                </p>
                            </article>

                            <article
                                className="about-origin-card about-origin-card-wide about-origin-final-card"
                                data-about-reveal
                            >
                                <span className="about-origin-number">
                                    03
                                </span>

                                <h3>
                                    {
                                        aboutContent.history
                                            .cards[2].title
                                    }
                                </h3>

                                <p>
                                    {
                                        aboutContent.history
                                            .cards[2].description
                                    }
                                </p>
                            </article>

                            <figure
                                className="about-origin-image about-origin-final-image"
                                data-about-reveal
                            >
                                <img
                                    src={
                                        aboutContent.history
                                            .cards[2]
                                            .image
                                            .imagePath
                                    }
                                    alt={
                                        aboutContent.history
                                            .cards[2]
                                            .image
                                            .imageAlt
                                    }
                                />
                            </figure>
                        </div>

                        
                    </div>
                </section>

                <section className="about-values-section">
                    <div className="container">
                        <div
                            className="about-values-header"
                            data-about-reveal
                        >
                            <p className="section-subtitle label-2">
                                {aboutContent.values.subtitle}
                            </p>

                            <h2 className="about-section-title">
                                {aboutContent.values.title}
                            </h2>
                        </div>

                        <div className="about-values-grid">
                            <article
                                className="about-value-card"
                                data-about-reveal
                            >
                                <span>
                                    01
                                </span>

                                <h3>
                                    {
                                        aboutContent.values
                                            .cards[0].title
                                    }
                                </h3>

                                <p>
                                    {
                                        aboutContent.values
                                            .cards[0].description
                                    }
                                </p>
                            </article>

                            <article
                                className="about-value-card"
                                data-about-reveal
                            >
                                <span>
                                    02
                                </span>

                                <h3>
                                    {
                                        aboutContent.values
                                            .cards[1].title
                                    }
                                </h3>

                                <p>
                                    {
                                        aboutContent.values
                                            .cards[1].description
                                    }
                                </p>
                            </article>

                            <article
                                className="about-value-card"
                                data-about-reveal
                            >
                                <span>
                                    03
                                </span>

                                <h3>
                                    {
                                        aboutContent.values
                                            .cards[2].title
                                    }
                                </h3>

                                <p>
                                    {
                                        aboutContent.values
                                            .cards[2].description
                                    }
                                </p>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="about-memory-section" aria-labelledby="memory-title">
                                        <div
                        className="about-memory-header"
                        data-about-reveal
                    >
                        <p className="section-subtitle label-2">
                            {aboutContent.memories.subtitle}
                        </p>

                        <h2
                            className="about-section-title"
                            id="memory-title"
                        >
                            {aboutContent.memories.title}
                        </h2>

                        <p>
                            {aboutContent.memories.intro}
                        </p>
                    </div>

                    <AboutMemoryGallery
                        images={
                            aboutContent.memories.images
                        }
                    />
                </section>

                <section className="about-location-section">
                    <div className="container">
                        <div className="about-location-shell" data-about-reveal>
                                                        <div className="about-location-content">
                                <p className="section-subtitle label-2">
                                    {aboutContent.location.subtitle}
                                </p>

                                <h2 className="about-section-title">
                                    {aboutContent.location.titlePrefix}{" "}
                                    {cityState}
                                </h2>

                                <div className="about-gold-line"></div>

                                <p>
                                    {
                                        aboutContent.location
                                            .descriptionBeforeCity
                                    }{" "}
                                    {city}
                                    {
                                        aboutContent.location
                                            .descriptionAfterCity
                                    }
                                </p>

                                <div className="about-location-actions">
                                    <a
                                        href={mapUrl}
                                        className="btn btn-secondary"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Visit Ronnie's Q at ${fullAddress}`}
                                    >
                                        <span className="text text-1">
                                            {
                                                aboutContent.location
                                                    .visitButtonText
                                            }
                                        </span>

                                        <span
                                            className="text text-2"
                                            aria-hidden="true"
                                        >
                                            {
                                                aboutContent.location
                                                    .visitButtonText
                                            }
                                        </span>
                                    </a>

                                    <Link
                                        href="/menu"
                                        className="about-text-link"
                                    >
                                        {
                                            aboutContent.location
                                                .menuButtonText
                                        }
                                    </Link>
                                </div>
                            </div>

                            <figure className="about-location-image">
                                <img
                                    src={
                                        aboutContent.location
                                            .image
                                            .imagePath
                                    }
                                    alt={
                                        aboutContent.location
                                            .image
                                            .imageAlt
                                    }
                                />
                            </figure>
                        </div>
                    </div>
                </section>
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

            <OrderModalController phoneHref={phoneHref} />

            <SiteScripts />
        </>
    );
}