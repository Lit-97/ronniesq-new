"use client";

import { useEffect, useState } from "react";
import OrderModal from "./OrderModal";

type OrderModalControllerProps = {
  phoneHref: string;
};

export default function OrderModalController({
  phoneHref,
}: OrderModalControllerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const orderButtons = document.querySelectorAll("[data-order-online]");

    const openModal = (event: Event) => {
      event.preventDefault();
      setIsOpen(true);
    };

    orderButtons.forEach((button) => {
      button.addEventListener("click", openModal);
    });

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      orderButtons.forEach((button) => {
        button.removeEventListener("click", openModal);
      });

      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <OrderModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      phoneHref={phoneHref}
    />
  );
}