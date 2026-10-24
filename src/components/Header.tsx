import { getHeaderHours } from "@/lib/restaurant-hours";
import LiveRestaurantStatus from "@/components/LiveRestaurantStatus";
import { getRestaurantContactInfo } from "@/lib/restaurant-contact";
import { getRestaurantLocationInfo } from "@/lib/restaurant-location";
import { getRestaurantBrandingInfo } from "@/lib/restaurant-branding";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Menu", href: "/menu" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];


export default async function Header() {
  const [
    headerHours,
    contactInfo,
    locationInfo,
    brandingInfo,
  ] = await Promise.all([
    getHeaderHours(),
    getRestaurantContactInfo(),
    getRestaurantLocationInfo(),
    getRestaurantBrandingInfo(),
  ]);

  const {
    todayText,
    customerMessage,
    isOpen,
    opensAt,
    closesAt,
  } = headerHours;

  const {
    phone,
    phoneHref,
    email,
  } = contactInfo;

  const {
    cityState,
    fullAddress,
  } = locationInfo;

  const {
    headerLogoPath,
  } = brandingInfo;

  return (
    <>
      {/* PRELOADER */}
      <div className="preload" data-preaload>
        <div className="circle"></div>
        <p className="text">Ronnie's Q</p>
      </div>

      {/* TOP BAR */}
      <div className="topbar">
        <div className="container">
          <address className="topbar-item">
            <div className="icon">
              <ion-icon name="location-outline" aria-hidden="true"></ion-icon>
            </div>

            <span className="span">
              {cityState}
            </span>
          </address>

          <div className="separator"></div>

          <div className="topbar-item item-2">
            <div className="icon">
              <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
            </div>

            <span className="span">
              <LiveRestaurantStatus
                initialTodayText={todayText}
                scheduledOpen={isOpen}
                opensAt={opensAt}
                closesAt={closesAt}
              />
            </span>
          </div>

          <a
            href={phoneHref}
            className="topbar-item link"
          >
            <div className="icon">
              <ion-icon name="call-outline" aria-hidden="true"></ion-icon>
            </div>

            <span className="span">{phone}</span>
          </a>

          <div className="separator"></div>

          <a
            href={`mailto:${email}`}
            className="topbar-item link"
          >
            <div className="icon">
              <ion-icon name="mail-outline" aria-hidden="true"></ion-icon>
            </div>

            <span className="span">
              {email}
            </span>
          </a>
        </div>
      </div>

      {/* HEADER */}
      <header
        className={`header ${customerMessage ? "has-announcement" : ""
          }`}
        data-header
      >
        {customerMessage && (
          <div
            className="site-announcement"
            role="status"
            aria-label="Restaurant notice"
          >
            <div className="container">
              <ion-icon
                name="megaphone-outline"
                aria-hidden="true"
              ></ion-icon>

              <p>{customerMessage}</p>
            </div>
          </div>
        )}

        <div className="container">
          <a href="/#home" className="logo header-logo" aria-label="Ronnie's Q home">
            <img
              src={headerLogoPath}
              width="190"
              height="70"
              alt="Ronnie's Q BBQ"
              className="header-logo-img"
            />
          </a>

          <nav className="navbar" data-navbar>
            <button className="close-btn" aria-label="close menu" data-nav-toggler>
              <ion-icon name="close-outline" aria-hidden="true"></ion-icon>
            </button>

            <a href="/#home" className="logo mobile-logo" aria-label="Ronnie's Q home">
              <img
                src={headerLogoPath}
                width="210"
                height="80"
                alt="Ronnie's Q BBQ"
                className="mobile-logo-img"
              />
            </a>

            <ul className="navbar-list">
              {navLinks.map((link) => (
                <li className="navbar-item" key={link.label}>
                  <a href={link.href} className="navbar-link hover-underline">
                    <div className="separator"></div>
                    <span className="span">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <p className="headline-1 navbar-title">Visit Us</p>

              <address className="body-4">
                {fullAddress}
              </address>

              <p className="body-4 navbar-text">
                <LiveRestaurantStatus
                  initialTodayText={todayText}
                  scheduledOpen={isOpen}
                  opensAt={opensAt}
                  closesAt={closesAt}
                />
              </p>

              <a
                href={`mailto:${email}`}
                className="body-4 sidebar-link"
              >
                {email}
              </a>

              <div className="separator"></div>

              <p className="contact-label">Call Us</p>

              <a
                href={phoneHref}
                className="body-1 contact-number hover-underline"
              >
                {phone}
              </a>
            </div>
          </nav>

          <a href="#order" className="btn btn-secondary" data-order-online>
            <span className="text text-1">Order Online</span>
            <span className="text text-2" aria-hidden="true">
              Order Online
            </span>
          </a>

          <button className="nav-open-btn" aria-label="open menu" data-nav-toggler>
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </button>

          <div
            className="overlay"
            data-nav-toggler
            data-overlay
          ></div>
        </div>
      </header>
    </>
  );
}