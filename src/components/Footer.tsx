import { getHeaderHours } from "@/lib/restaurant-hours";
import { getRestaurantContactInfo } from "@/lib/restaurant-contact";
import { getRestaurantLocationInfo } from "@/lib/restaurant-location";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/ronniesqbbq",
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/explore/locations/1020474675/ronnies-q/",
    external: true,
  },
  {
    label: "Twitter",
    href: "https://x.com/RonniesQBBQ",
    external: true,
  },

  {
    label: "Staff Portal",
    href: "/admin/login",
  },
];

export default async function Footer() {
  const [
    restaurantHours,
    contactInfo,
    locationInfo,
  ] = await Promise.all([
    getHeaderHours(),
    getRestaurantContactInfo(),
    getRestaurantLocationInfo(),
  ]);

  const { weeklyScheduleLines } =
    restaurantHours;

  const {
    phone,
    phoneHref,
    email,
  } = contactInfo;

  const {
    fullAddress,
    mapUrl,
  } = locationInfo;

  const footerSocialLinks = [
  ...socialLinks.slice(0, 3),

  {
    label: "Google Map",
    href: mapUrl,
    external: true,
  },

  ...socialLinks.slice(3),
];

  return (
    <footer
      className="footer section has-bg-image text-center"
      style={{
        backgroundImage: `
      linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.38) 0%,
        rgba(0, 0, 0, 0.38) 52%,
        rgba(0, 0, 0, 0.62) 70%,
        rgba(0, 0, 0, 0.84) 100%
      ),
      url('/images/footer-bg.png')
    `,
      }}
    >
      <div className="container">
        <div className="footer-top grid-list">
          <div className="footer-brand has-before has-after">
            <a href="/#home" className="logo" aria-label="Ronnie's Q home">
              <span className="section-title headline-2">Ronnie&apos;s Q</span>
            </a>

            <address className="body-4">
  {fullAddress}
</address>

            <a
              href={`mailto:${email}`}
              className="body-4 contact-link"
            >
              {email}
            </a>

            <a
              href={phoneHref}
              className="body-4 contact-link"
            >
              Call To Order : {phone}
            </a>

            <div className="footer-hours">
              {weeklyScheduleLines.map((line) => (
                <p
                  className="body-4"
                  key={`${line.dayLabel}-${line.hoursText}`}
                >
                  {line.dayLabel} : {line.hoursText}
                </p>
              ))}
            </div>

            <div className="wrapper" aria-hidden="true">
              <div className="separator"></div>
              <div className="separator"></div>
              <div className="separator"></div>
            </div>

            <p className="title-1 footer-cta-title">Call Ahead</p>

            <p className="label-1">
              Give us a call to place your order or ask about today&apos;s specials.
            </p>

            <div className="footer-cta">
              <a
                href={phoneHref}
                className="btn btn-secondary"
              >
                <span className="text text-1">
                  Call Now
                </span>

                <span
                  className="text text-2"
                  aria-hidden="true"
                >
                  Call Now
                </span>
              </a>
            </div>
          </div>

          <ul className="footer-list">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="label-2 footer-link hover-underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <ul className="footer-list">
            {footerSocialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="label-2 footer-link hover-underline"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; 2026 Ronnie&apos;s Q. All Rights Reserved | Website by{" "}
            <a
              href="https://litney-portfolio.vercel.app"
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lit
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}