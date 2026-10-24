"use client";

import { useEffect, useState } from "react";

type AboutMemoryGalleryImage = {
  id: number;
  imagePath: string;
  imageAlt: string;
  displayOrder: number;
};

type AboutMemoryGalleryProps = {
  images: AboutMemoryGalleryImage[];
};

export default function AboutMemoryGallery({ images }: AboutMemoryGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const memorySlides = [...images, ...images];
  const activeImage = activeIndex === null ? null : images[activeIndex];

  function openImage(index: number) {
    setActiveIndex(index % images.length);
  }

  function closeImage() {
    setActiveIndex(null);
  }

  function showPrevious() {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    });
  }

  function showNext() {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    });
  }

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeImage();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  return (
    <>
      <div className="about-memory-carousel" aria-label="Ronnie's Q photo memories">
        <div className="about-memory-track">
          {memorySlides.map((image, index) => (
            <figure
              className="about-memory-slide"
              key={`${image.id}-${index}`}
            >
              <button
                type="button"
                className="about-memory-slide-button"
                onClick={() => openImage(index)}
                aria-label={`Open ${image.imageAlt}`}
              >
                <img
                  src={image.imagePath}
                  alt={image.imageAlt}
                  loading="lazy"
                />
              </button>
            </figure>
          ))}
        </div>
      </div>

      {activeImage && (
        <div
          className="about-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Ronnie's Q photo viewer"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeImage();
            }
          }}
        >
          <button
            type="button"
            className="about-lightbox-close"
            onClick={closeImage}
            aria-label="Close image viewer"
          >
            ×
          </button>

          <button
            type="button"
            className="about-lightbox-arrow about-lightbox-prev"
            onClick={showPrevious}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="about-lightbox-image-wrap">
            <img
              src={activeImage.imagePath}
              alt={`${activeImage.imageAlt} enlarged`}
              className="about-lightbox-image"
            />
          </div>

          <button
            type="button"
            className="about-lightbox-arrow about-lightbox-next"
            onClick={showNext}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}