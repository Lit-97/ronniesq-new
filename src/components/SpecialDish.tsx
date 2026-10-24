import {
  getHomepageSpecialDishContent,
} from "@/lib/homepage-special-dish";

export default async function SpecialDish() {
  const content =
    await getHomepageSpecialDishContent();

  return (
    <section
      className="special-dish text-center"
      aria-labelledby="dish-label"
    >
      <div className="special-dish-banner">
        <img
          src={content.imagePath}
          width="940"
          height="900"
          loading="lazy"
          alt={content.imageAlt}
          className="img-cover"
        />
      </div>

      <div className="special-dish-content bg-black-10">
        <div className="container">
          <img
            src="/images/badge-1.png"
            width="28"
            height="41"
            loading="lazy"
            alt=""
            aria-hidden="true"
            className="abs-img"
          />

          <p
            className="section-subtitle label-2"
            id="dish-label"
          >
            {content.subtitle}
          </p>

          <h2 className="headline-1 section-title">
            {content.titleLine1}
            <br />

            {content.titleLine2}
            <br />

            {content.titleLine3}
          </h2>

          <p className="section-text">
            {content.description}
          </p>

          <div className="wrapper">
            <span className="span body-1">
              {content.price}
            </span>
          </div>

          <a
            href="/menu"
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
      </div>

      <img
        src="/images/shape-4.png"
        width="179"
        height="359"
        loading="lazy"
        alt=""
        aria-hidden="true"
        className="shape shape-1"
      />

      <img
        src="/images/shape-9.png"
        width="351"
        height="462"
        loading="lazy"
        alt=""
        aria-hidden="true"
        className="shape shape-2"
      />
    </section>
  );
}