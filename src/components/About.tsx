import { getRestaurantContactInfo } from "@/lib/restaurant-contact";
import { getHomepageAboutContent } from "@/lib/homepage-about";

export default async function About() {
  const [
    contactInfo,
    content,
  ] = await Promise.all([
    getRestaurantContactInfo(),
    getHomepageAboutContent(),
  ]);

  const {
    phone,
    phoneHref,
  } = contactInfo;

  return (
    <section
      className="section about text-center"
      aria-labelledby="about-label"
      id="about"
    >
      <div className="container">
        <div className="about-content">
          <p
            className="label-2 section-subtitle"
            id="about-label"
          >
            {content.subtitle}
          </p>

          <h2 className="headline-1 section-title">
            {content.title}
          </h2>

          <p className="section-text">
            {content.description}
          </p>

          <div className="contact-label">
            Call Us
          </div>

          <a
            href={phoneHref}
            className="body-1 contact-number hover-underline"
          >
            {phone}
          </a>

          <a
            href="#contact"
            className="btn btn-primary"
          >
            <span className="text text-1">
              {content.buttonText}
            </span>

            <span
              className="text text-2"
              aria-hidden="true"
            >
              {content.buttonText}
            </span>
          </a>
        </div>

        <figure className="about-banner">
          <img
            src={content.mainImagePath}
            width="570"
            height="570"
            loading="lazy"
            alt={content.mainImageAlt}
            className="w-100"
            data-parallax-item
            data-parallax-speed="1"
          />

          <div
            className="abs-img abs-img-1 has-before"
            data-parallax-item
            data-parallax-speed="1.75"
          >
            <img
              src={content.insetImagePath}
              width="285"
              height="285"
              loading="lazy"
              alt={content.insetImageAlt}
              className="w-100"
            />
          </div>

          <div className="abs-img abs-img-2 has-before">
            <img
              src="/images/badge-2.png"
              width="133"
              height="134"
              loading="lazy"
              alt=""
              aria-hidden="true"
            />
          </div>
        </figure>

        <img
          src="/images/shape-3.png"
          width="197"
          height="194"
          loading="lazy"
          alt=""
          aria-hidden="true"
          className="shape"
        />
      </div>
    </section>
  );
}