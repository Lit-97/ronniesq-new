"use client";

import { useEffect } from "react";

export default function SiteScripts() {
  useEffect(() => {
    const preloader = document.querySelector("[data-preaload]");
    const navbar = document.querySelector("[data-navbar]");
    const navTogglers = document.querySelectorAll("[data-nav-toggler]");
    const overlay = document.querySelector("[data-overlay]");
    const header = document.querySelector("[data-header]");
    const backTopBtn = document.querySelector("[data-back-top-btn]");

    const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
    const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
    const heroSliderNextBtn = document.querySelector("[data-next-btn]");

    const parallaxItems = document.querySelectorAll<HTMLElement>("[data-parallax-item]");

    const addEventOnElements = (
      elements: NodeListOf<Element> | Element[],
      eventType: string,
      callback: EventListener
    ) => {
      for (let i = 0, len = elements.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
      }
    };

    const handleLoad = () => {
      preloader?.classList.add("loaded");
      document.body.classList.add("loaded");
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    const toggleNavbar = () => {
      navbar?.classList.toggle("active");
      overlay?.classList.toggle("active");
      document.body.classList.toggle("nav-active");
    };

    addEventOnElements(navTogglers, "click", toggleNavbar);

    let lastScrollPos = 0;

    const hideHeader = () => {
      const isScrollBottom = lastScrollPos < window.scrollY;

      if (isScrollBottom) {
        header?.classList.add("hide");
      } else {
        header?.classList.remove("hide");
      }

      lastScrollPos = window.scrollY;
    };

    const handleScroll = () => {
      if (window.scrollY >= 50) {
        header?.classList.add("active");
        backTopBtn?.classList.add("active");
        hideHeader();
      } else {
        header?.classList.remove("active");
        backTopBtn?.classList.remove("active");
      }
    };

    const scrollToTop = (event: Event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    };

    window.addEventListener("scroll", handleScroll);
    backTopBtn?.addEventListener("click", scrollToTop);

    let currentSlidePos = 0;
    let lastActiveSliderItem = heroSliderItems[0];
    let autoSlideInterval: ReturnType<typeof setInterval> | undefined;

    const updateSliderPos = () => {
      lastActiveSliderItem?.classList.remove("active");
      heroSliderItems[currentSlidePos]?.classList.add("active");
      lastActiveSliderItem = heroSliderItems[currentSlidePos];
    };

    const slideNext = () => {
      if (heroSliderItems.length === 0) return;

      if (currentSlidePos >= heroSliderItems.length - 1) {
        currentSlidePos = 0;
      } else {
        currentSlidePos++;
      }

      updateSliderPos();
    };

    const slidePrev = () => {
      if (heroSliderItems.length === 0) return;

      if (currentSlidePos <= 0) {
        currentSlidePos = heroSliderItems.length - 1;
      } else {
        currentSlidePos--;
      }

      updateSliderPos();
    };

    const autoSlide = () => {
      if (heroSliderItems.length === 0) return;

      autoSlideInterval = setInterval(() => {
        slideNext();
      }, 7000);
    };

    const stopAutoSlide = () => {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
    };

    heroSliderNextBtn?.addEventListener("click", slideNext);
    heroSliderPrevBtn?.addEventListener("click", slidePrev);

    heroSliderNextBtn?.addEventListener("mouseover", stopAutoSlide);
    heroSliderPrevBtn?.addEventListener("mouseover", stopAutoSlide);

    heroSliderNextBtn?.addEventListener("mouseout", autoSlide);
    heroSliderPrevBtn?.addEventListener("mouseout", autoSlide);

    autoSlide();

    const handleMouseMove = (event: MouseEvent) => {
      let x = (event.clientX / window.innerWidth) * 10 - 5;
      let y = (event.clientY / window.innerHeight) * 10 - 5;

      x = x - x * 2;
      y = y - y * 2;

      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallaxSpeed || 1);
        const moveX = x * speed;
        const moveY = y * speed;

        item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);

      backTopBtn?.removeEventListener("click", scrollToTop);

      navTogglers.forEach((element) => {
        element.removeEventListener("click", toggleNavbar);
      });

      heroSliderNextBtn?.removeEventListener("click", slideNext);
      heroSliderPrevBtn?.removeEventListener("click", slidePrev);

      heroSliderNextBtn?.removeEventListener("mouseover", stopAutoSlide);
      heroSliderPrevBtn?.removeEventListener("mouseover", stopAutoSlide);

      heroSliderNextBtn?.removeEventListener("mouseout", autoSlide);
      heroSliderPrevBtn?.removeEventListener("mouseout", autoSlide);

      if (autoSlideInterval) clearInterval(autoSlideInterval);
    };
  }, []);

  return null;
}