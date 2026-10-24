import {
  getHomepageFeaturesContent,
} from "@/lib/homepage-features";

export default async function Features() {
  const content =
    await getHomepageFeaturesContent();

  return (
    <section
      className="section features text-center"
      aria-labelledby="features-label"
    >
      <div className="container">
        <p className="section-subtitle label-2">
          {content.subtitle}
        </p>

        <h2
          className="headline-1 section-title"
          id="features-label"
        >
          {content.title}
        </h2>

        <ul className="grid-list">
          {content.cards.map((feature) => (
            <li
              className="feature-item"
              key={feature.cardNumber}
            >
              <div className="feature-card">
                <div className="card-icon">
                  <img
                    src={feature.iconPath}
                    width="100"
                    height="80"
                    loading="lazy"
                    alt=""
                    aria-hidden="true"
                  />
                </div>

                <h3 className="title-2 card-title">
                  {feature.title}
                </h3>

                <p className="label-1 card-text">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <img
          src="/images/shape-7.png"
          width="208"
          height="178"
          loading="lazy"
          alt=""
          aria-hidden="true"
          className="shape shape-1"
        />

        <img
          src="/images/shape-8.png"
          width="120"
          height="115"
          loading="lazy"
          alt=""
          aria-hidden="true"
          className="shape shape-2"
        />
      </div>
    </section>
  );
}