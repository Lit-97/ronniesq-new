"use client";

import {
  useState,
} from "react";

import type {
  HomepageTestimonialReview,
  HomepageTestimonialsContent,
} from "@/lib/homepage-testimonials";

type TestimonialsClientProps = {
  content: HomepageTestimonialsContent;
};

function shortenReview(
  text: string,
  limit = 145,
) {
  if (text.length <= limit) {
    return text;
  }

  return `${text
    .slice(0, limit)
    .trim()}...`;
}

function ReviewStars({
  rating,
}: {
  rating: number;
}) {
  return (
    <div
      className="review-stars"
      aria-label={`${rating} star review`}
    >
      {Array.from(
        {
          length: rating,
        },
        (_, index) => (
          <span
            aria-hidden="true"
            key={index}
          >
            ★
          </span>
        ),
      )}
    </div>
  );
}

export default function TestimonialsClient({
  content,
}: TestimonialsClientProps) {
  const [
    selectedReview,
    setSelectedReview,
  ] =
    useState<HomepageTestimonialReview | null>(
      null,
    );

  const scrollingReviews = [
    ...content.reviews,
    ...content.reviews,
  ];

  return (
    <>
      <section
        className="section testi review-carousel-section text-center has-bg-image"
        style={{
          backgroundImage:
            `url("${content.backgroundImagePath}")`,
        }}
        aria-labelledby="reviews-label"
      >
        <div className="container">
          <p className="section-subtitle label-2">
            {content.subtitle}
          </p>

          <h2
            className="headline-1 section-title"
            id="reviews-label"
          >
            {content.title}
          </h2>

          <p className="review-intro">
            {content.intro}
          </p>
        </div>

        <div className="review-carousel">
          <div className="review-track">
            {scrollingReviews.map(
              (review, index) => {
                const isLongReview =
                  review.text.length >
                  145;

                return (
                  <article
                    className="review-card"
                    key={`${review.reviewNumber}-${index}`}
                  >
                    <p className="review-text">
                      “
                      {shortenReview(
                        review.text,
                      )}
                      ”

                      {isLongReview && (
                        <button
                          type="button"
                          className="review-more"
                          onClick={() =>
                            setSelectedReview(
                              review,
                            )
                          }
                        >
                          More
                        </button>
                      )}
                    </p>

                    <div className="review-footer">
                      <img
                        src="/images/google-g.svg"
                        width="42"
                        height="42"
                        loading="lazy"
                        alt="Google"
                        className="review-google-icon"
                      />

                      <div className="review-meta">
                        <p className="review-name">
                          {review.name}
                        </p>

                        <ReviewStars
                          rating={
                            review.rating
                          }
                        />
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </div>
      </section>

      {selectedReview && (
        <div
          className="review-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
          onClick={() =>
            setSelectedReview(null)
          }
        >
          <div
            className="review-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="review-modal-close"
              aria-label="Close review"
              onClick={() =>
                setSelectedReview(null)
              }
            >
              ×
            </button>

            <div className="review-modal-header">
              <img
                src="/images/google-g.svg"
                width="46"
                height="46"
                alt="Google"
                className="review-google-icon"
              />

              <div>
                <p
                  className="review-modal-name"
                  id="review-modal-title"
                >
                  {selectedReview.name}
                </p>

                <ReviewStars
                  rating={
                    selectedReview.rating
                  }
                />
              </div>
            </div>

            <p className="review-modal-text">
              “{selectedReview.text}”
            </p>
          </div>
        </div>
      )}
    </>
  );
}