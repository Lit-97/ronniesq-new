import { getHomepageHeroSlides } from "@/lib/homepage-hero";

const heroSlidePresentation = {
  1: {
    buttonHref: "#menu",
    isActive: true,
  },

  2: {
    buttonHref: "#menu",
    isActive: false,
  },

  3: {
    buttonHref: "#contact",
    isActive: false,
  },
} as const;

export default async function Hero() {
  const heroSlides =
    await getHomepageHeroSlides();

  return (
    <section
      className="hero text-center"
      aria-label="home"
      id="home"
    >
      <ul
        className="hero-slider"
        data-hero-slider
      >
        {heroSlides.map((slide) => {
          const presentation =
            heroSlidePresentation[
            slide.slideNumber as keyof typeof heroSlidePresentation
            ];

          return (
            <li
              key={slide.slideNumber}
              className={`slider-item ${presentation.isActive
                  ? "active"
                  : ""
                }`}
              data-hero-slider-item
            >
              <div className="slider-bg">
                <img
                  src={slide.imagePath}
                  width="1880"
                  height="950"
                  alt=""
                  className="img-cover"
                />
              </div>

              <p className="label-2 section-subtitle slider-reveal">
                {slide.subtitle}
              </p>

              <h1 className="display-1 hero-title slider-reveal">
                {slide.titleLine1}
                <br />
                {slide.titleLine2}
              </h1>

              <p className="body-2 hero-text slider-reveal">
                {slide.description}
              </p>

              <a
                href={presentation.buttonHref}
                className="btn btn-primary slider-reveal"
              >
                <span className="text text-1">
                  {slide.buttonText}
                </span>

                <span
                  className="text text-2"
                  aria-hidden="true"
                >
                  {slide.buttonText}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <button
        className="slider-btn prev"
        aria-label="slide to previous"
        data-prev-btn
      >
        <ion-icon
          name="chevron-back"
          aria-hidden="true"
        ></ion-icon>
      </button>

      <button
        className="slider-btn next"
        aria-label="slide to next"
        data-next-btn
      >
        <ion-icon
          name="chevron-forward"
          aria-hidden="true"
        ></ion-icon>
      </button>

      <a
        href="/menu"
        className="hero-btn has-after"
      >
        <img
          src="/images/hero-icon.png"
          width="48"
          height="48"
          alt=""
        />

        <span className="label-2 text-center span">
          View Menu
        </span>
      </a>
    </section>
  );
}