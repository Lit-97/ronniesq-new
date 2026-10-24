import {
  getHomepageServicesContent,
} from "@/lib/homepage-services";

export default async function Services() {
  const content =
    await getHomepageServicesContent();

  return (
    <section
      className="section service bg-black-10 text-center"
      aria-label="Ronnie's Q favorites and catering"
      id="catering"
    >
      <div className="container">
        <p className="section-subtitle label-2">
          {content.subtitle}
        </p>

        <h2 className="headline-1 section-title">
          {content.title}
        </h2>

        <p className="section-text">
          {content.description}
        </p>

        <ul className="grid-list">
          {content.cards.map(
            (service) => (
              <li
                key={
                  service.cardNumber
                }
              >
                <div className="service-card">
                  <a
                    href={
                      service.href
                    }
                    className="has-before hover:shine"
                  >
                    <figure
                      className="card-banner img-holder"
                      style={
                        {
                          "--width":
                            285,
                          "--height":
                            336,
                        } as React.CSSProperties
                      }
                    >
                      <img
                        src={
                          service.imagePath
                        }
                        width="285"
                        height="336"
                        loading="lazy"
                        alt={
                          service.imageAlt
                        }
                        className="img-cover"
                      />
                    </figure>
                  </a>

                  <div className="card-content">
                    <h3 className="title-4 card-title">
                      <a
                        href={
                          service.href
                        }
                      >
                        {
                          service.title
                        }
                      </a>
                    </h3>

                    <a
                      href={
                        service.href
                      }
                      className="btn-text hover-underline label-2"
                    >
                      {
                        service.buttonText
                      }
                    </a>
                  </div>
                </div>
              </li>
            ),
          )}
        </ul>

        <img
          src="/images/shape-1.png"
          width="246"
          height="412"
          loading="lazy"
          alt=""
          className="shape shape-1 move-anim"
        />

        <img
          src="/images/shape-2.png"
          width="343"
          height="345"
          loading="lazy"
          alt=""
          className="shape shape-2 move-anim"
        />
      </div>
    </section>
  );
}