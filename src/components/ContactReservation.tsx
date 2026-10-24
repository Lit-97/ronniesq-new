"use client";

import { useEffect, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

const FORMSPREE_FORM_ID = "mqerolpj";

type WeeklyScheduleLine = {
  dayLabel: string;
  hoursText: string;
};

type TodaySpecialHours = {
  dateLabel: string;
  isOpen: boolean;
  hoursText: string;
  message: string | null;
};

type CustomerNoticeDisplay = {
  message: string;
  isEnabled: boolean;
};

type ContactReservationProps = {
  weeklyScheduleLines: WeeklyScheduleLine[];
  todaySpecialHours: TodaySpecialHours | null;
  phone: string;
  phoneHref: string;
  fullAddress: string;
  sameDayOrderNotice: CustomerNoticeDisplay | null;
  onlineOrderingNotice: CustomerNoticeDisplay | null;
};

export default function ContactReservation({
  weeklyScheduleLines,
  todaySpecialHours,
  phone,
  phoneHref,
  fullAddress,
  sameDayOrderNotice,
  onlineOrderingNotice,
}: ContactReservationProps) {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);
  const [minimumRequestDate, setMinimumRequestDate] = useState("");

  useEffect(() => {
    const tomorrow = new Date();

    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");

    setMinimumRequestDate(`${year}-${month}-${day}`);
  }, []);

  return (
    <section
      className="reservation"
      id="contact"
      aria-labelledby="contact-label"
    >
      <div className="container">
        <div className="form reservation-form bg-black-10">
          <form className="form-left" onSubmit={handleSubmit}>
            <h2
              className="headline-1 text-center contact-heading"
              id="contact-label"
            >
              Contact Ronnie&apos;s Q
            </h2>

            <p className="form-text text-center">
              Call us at{" "}
              <a href={phoneHref} className="link">
                {phone}
              </a>{" "}
              or send us a message about orders, catering, or questions.
            </p>

            {/* NAME AND EMAIL */}
            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                autoComplete="name"
                className="input-field"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                autoComplete="email"
                className="input-field"
                required
              />
            </div>

            {/* PHONE AND REASON */}
            <div className="input-wrapper contact-secondary-row">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                autoComplete="tel"
                className="input-field"
              />

              <div className="icon-wrapper">
                <ion-icon
                  name="restaurant-outline"
                  aria-hidden="true"
                ></ion-icon>

                <select
                  name="reason"
                  className="input-field"
                  defaultValue="General Question"
                >
                  <option value="General Question">
                    General Question
                  </option>

                  <option value="Order Question">
                    Order Question
                  </option>

                  <option value="Menu Question">
                    Menu Question
                  </option>

                  <option value="Catering Request">
                    Catering Request
                  </option>

                  <option value="Event or Large Order">
                    Event / Large Order
                  </option>

                  <option value="Customer Feedback">
                    Customer Feedback
                  </option>

                  <option value="Website Issue or Feedback">
                    Website Issue or Feedback
                  </option>

                  <option value="Other">Other</option>
                </select>

                <ion-icon
                  name="chevron-down"
                  aria-hidden="true"
                ></ion-icon>
              </div>
            </div>

            {/* DATE AND CONTACT TIME */}
            <div className="input-wrapper contact-details-row">
              <div className="icon-wrapper">
                <ion-icon
                  name="calendar-clear-outline"
                  aria-hidden="true"
                ></ion-icon>

                <input
                  type="date"
                  name="requestedDate"
                  className="input-field"
                  min={minimumRequestDate}
                  disabled={!minimumRequestDate}
                />

                <ion-icon
                  name="chevron-down"
                  aria-hidden="true"
                ></ion-icon>
              </div>

              <div className="icon-wrapper">
                <ion-icon
                  name="time-outline"
                  aria-hidden="true"
                ></ion-icon>

                <select
                  name="bestTime"
                  className="input-field"
                  defaultValue="Any Time"
                >
                  <option value="Any Time">Any Time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>

                <ion-icon
                  name="chevron-down"
                  aria-hidden="true"
                ></ion-icon>
              </div>
            </div>

            <textarea
              name="message"
              placeholder="Message"
              autoComplete="off"
              className="input-field"
              required
            ></textarea>

            {sameDayOrderNotice?.isEnabled && (
              <p className="homepage-contact-note">
                {sameDayOrderNotice.message}
              </p>
            )}


            {/* FORMSPREE EMAIL SUBJECT */}
            <input
              type="hidden"
              name="subject"
              value="New Ronnie's Q Website Message"
            />

            {/* SPAM PROTECTION */}
            <input
              type="text"
              name="_gotcha"
              className="homepage-contact-honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <button
              type="submit"
              className="btn btn-secondary"
              disabled={state.submitting || state.succeeded}
            >
              <span className="text text-1">
                {state.submitting
                  ? "Sending..."
                  : state.succeeded
                    ? "Message Sent"
                    : "Send Message"}
              </span>

              <span className="text text-2" aria-hidden="true">
                {state.submitting
                  ? "Sending..."
                  : state.succeeded
                    ? "Message Sent"
                    : "Send Message"}
              </span>
            </button>

            <div
              className="homepage-contact-status"
              aria-live="polite"
            >
              {state.succeeded && (
                <p className="homepage-contact-success">
                  Thank you! Your message has been sent to Ronnie&apos;s Q.
                  We will respond as soon as possible.
                </p>
              )}

              {!state.succeeded && (
                <ValidationError
                  className="homepage-contact-error"
                  errors={state.errors}
                />
              )}
            </div>
          </form>

          <div
            className="form-right text-center"
            style={{
              backgroundImage: "url('/images/form-pattern.png')",
            }}
          >
            <h2 className="headline-1 text-center contact-heading">
              Visit Us
            </h2>

            <p className="contact-label">Call To Order</p>

            <a
              href={phoneHref}
              className="body-1 contact-number hover-underline"
            >
              {phone}
            </a>

            <div className="separator"></div>

            <p className="contact-label">Location</p>

            <address className="body-4">
              {fullAddress}
            </address>

            <p className="contact-label">Hours</p>

            <div
              className={`homepage-hours-list body-4 ${todaySpecialHours
                ? "has-special-hours"
                : "regular-hours-only"
                }`}
            >
              {todaySpecialHours && (
                <div className="homepage-hours-special">
                  <p className="homepage-hours-special-label">
                    Current Special Hours
                  </p>

                  <div className="homepage-hours-row homepage-hours-special-row">
                    <span>{todaySpecialHours.dateLabel}</span>

                    <strong
                      className={
                        todaySpecialHours.isOpen
                          ? undefined
                          : "is-closed"
                      }
                    >
                      {todaySpecialHours.isOpen
                        ? todaySpecialHours.hoursText.replace(
                          " to ",
                          " - ",
                        )
                        : "Closed"}
                    </strong>
                  </div>

                  {todaySpecialHours.message && (
                    <small className="homepage-hours-special-message">
                      {todaySpecialHours.message}
                    </small>
                  )}
                </div>
              )}

              {todaySpecialHours && (
                <p className="homepage-hours-regular-label">
                  Regular Weekly Hours
                </p>
              )}

              {weeklyScheduleLines.map((line) => (
                <div
                  className="homepage-hours-row homepage-hours-regular-row"
                  key={`${line.dayLabel}-${line.hoursText}`}
                >
                  <span>{line.dayLabel}</span>
                  <strong>{line.hoursText}</strong>
                </div>
              ))}
            </div>

            {onlineOrderingNotice?.isEnabled && (
              <>
                <p className="contact-label">
                  Online Ordering
                </p>

                <p className="body-4">
                  {onlineOrderingNotice.message}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}