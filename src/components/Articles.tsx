import {
  getHomepageArticlesContent,
} from "@/lib/homepage-articles";

export default async function Articles() {
  const content =
    await getHomepageArticlesContent();

  return (
    <section
      className="section articles bg-black-10"
      aria-labelledby="articles-label"
    >
      <div className="container">
        <p className="section-subtitle label-2 text-center">
          {content.subtitle}
        </p>

        <h2
          className="section-title headline-1 text-center"
          id="articles-label"
        >
          {content.title}
        </h2>

        <ul className="grid-list">
          {content.cards.map(
            (article) => (
              <li
                key={
                  article.cardNumber
                }
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-card article-link has-before hover:shine"
                  aria-label={`Read article: ${article.title}`}
                >
                  <div
                    className="card-banner img-holder"
                    style={
                      {
                        "--width": 350,
                        "--height": 450,
                      } as React.CSSProperties
                    }
                  >
                    <img
                      src={
                        article.imagePath
                      }
                      width="350"
                      height="450"
                      loading="lazy"
                      alt={
                        article.imageAlt
                      }
                      className="img-cover"
                    />

                    <time
                      className="article-source label-2"
                      dateTime={
                        article.datetime
                      }
                    >
                      {
                        article.source
                      }
                    </time>
                  </div>

                  <div className="card-content">
                    <p className="card-subtitle label-2 text-center">
                      {
                        content.articleLabel
                      }
                    </p>

                    <h3 className="card-title title-2 text-center">
                      {
                        article.title
                      }
                    </h3>
                  </div>
                </a>
              </li>
            ),
          )}
        </ul>

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
    </section>
  );
}