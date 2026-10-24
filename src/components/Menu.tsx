import { getRestaurantContactInfo } from "@/lib/restaurant-contact";
import { getHomepageMenuContent } from "@/lib/homepage-menu";

export default async function Menu() {
  const [
    contactInfo,
    content,
  ] = await Promise.all([
    getRestaurantContactInfo(),
    getHomepageMenuContent(),
  ]);

  const {
    phone,
    phoneHref,
  } = contactInfo;

  return (
    <section
      className="section menu"
      aria-labelledby="menu-label"
      id="menu"
    >
      <div className="container">
        <p className="section-subtitle text-center label-2">
          {content.subtitle}
        </p>

        <h2
          className="headline-1 section-title text-center"
          id="menu-label"
        >
          {content.title}
        </h2>

        <ul className="grid-list">
          {content.items.map((item) => (
            <li key={item.itemNumber}>
              <div className="menu-card hover:card">
                <figure
                  className="card-banner img-holder"
                  style={
                    {
                      "--width": 100,
                      "--height": 100,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src={item.imagePath}
                    width="100"
                    height="100"
                    loading="lazy"
                    alt={item.imageAlt}
                    className="img-cover"
                  />
                </figure>

                <div>
                  <div className="title-wrapper">
                    <h3 className="title-3">
                      <a
                        href="/menu"
                        className="card-title"
                      >
                        {item.name}
                      </a>
                    </h3>

                    {item.badge && (
                      <span className="badge label-1">
                        {item.badge}
                      </span>
                    )}

                    <span className="span title-2">
                      {item.price}
                    </span>
                  </div>

                  {item.description && (
                    <p className="card-text label-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="menu-text text-center">
          {content.noticeBeforePhone}{" "}

          <a
            href={phoneHref}
            className="span"
          >
            {phone}
          </a>{" "}

          {content.noticeAfterPhone}
        </p>

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

        <img
          src="/images/shape-5.png"
          width="921"
          height="1036"
          loading="lazy"
          alt=""
          aria-hidden="true"
          className="shape shape-2 move-anim"
        />

        <img
          src="/images/shape-6.png"
          width="343"
          height="345"
          loading="lazy"
          alt=""
          aria-hidden="true"
          className="shape shape-3 move-anim"
        />
      </div>
    </section>
  );
}