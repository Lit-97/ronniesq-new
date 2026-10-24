"use client";

type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  phoneHref: string;
};

export default function OrderModal({
  isOpen,
  onClose,
  phoneHref,
}: OrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="order-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
      <div className="order-modal">
        <button className="order-modal-close" type="button" aria-label="Close order popup" onClick={onClose}>
          ×
        </button>

        <p className="section-subtitle label-2">Coming Soon</p>

        <h2 className="headline-1" id="order-modal-title">
          Online Ordering Coming Soon
        </h2>

        <p className="body-2 order-modal-text">
          Ronnie's Q is preparing online ordering for future pickup and catering requests. For now, please call us directly
          to place an order.
        </p>

        <div className="order-modal-actions">
          <a href={phoneHref} className="btn btn-secondary">
            <span className="text text-1">Call Now</span>
            <span className="text text-2" aria-hidden="true">
              Call Now
            </span>
          </a>

          <a href="/menu" className="btn btn-primary" onClick={onClose}>
            <span className="text text-1">View Menu</span>
            <span className="text text-2" aria-hidden="true">
              View Menu
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}