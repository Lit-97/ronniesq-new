"use client";

import { useEffect, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

const FORMSPREE_FORM_ID = "mqerolpj";

type CustomerNoticeDisplay = {
  message: string;
  isEnabled: boolean;
};

type ContactFormProps = {
  sameDayOrderNotice: CustomerNoticeDisplay | null;
};

export default function ContactForm({
  sameDayOrderNotice,
}: ContactFormProps) {

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
    <form className="contact-page-form" onSubmit={handleSubmit}>
      <input
        type="hidden"
        name="subject"
        value="New Ronnie's Q Website Message from {{ name }}"
        readOnly
      />

      {/* Spam-protection honeypot */}
      <input
        className="contact-page-honeypot"
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="contact-page-form-heading">
        <span>Contact Form</span>
        <h3>Send Ronnie&apos;s Q a Message</h3>
      </div>

      <div className="contact-page-form-grid">
        <label className="contact-page-field">
          <span>
            Your Name <strong>*</strong>
          </span>

          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Enter your name"
            required
          />

          <ValidationError
            className="contact-page-field-error"
            prefix="Name"
            field="name"
            errors={state.errors}
          />
        </label>

        <label className="contact-page-field">
          <span>
            Email Address <strong>*</strong>
          </span>

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            required
          />

          <ValidationError
            className="contact-page-field-error"
            prefix="Email"
            field="email"
            errors={state.errors}
          />
        </label>

        <label className="contact-page-field">
          <span>Phone Number</span>

          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="Enter your phone number"
          />

          <ValidationError
            className="contact-page-field-error"
            prefix="Phone"
            field="phone"
            errors={state.errors}
          />
        </label>

        <label className="contact-page-field">
          <span>Reason for Contacting Us</span>

          <select name="reason" defaultValue="General Question">
            <option value="General Question">General Question</option>
            <option value="Order Question">Order Question</option>
            <option value="Menu Question">Menu Question</option>
            <option value="Catering Request">Catering Request</option>
            <option value="Event or Large Order">
              Event or Large Order
            </option>
            <option value="Customer Feedback">Customer Feedback</option>
            <option value="Website Issue or Feedback">
              Website Issue or Feedback
            </option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="contact-page-field">
          <span>Requested Date</span>
          <input
            type="date"
            name="requestedDate"
            min={minimumRequestDate}
            disabled={!minimumRequestDate}
          />
        </label>

        <label className="contact-page-field">
          <span>Best Time to Contact You</span>

          <select name="bestTime" defaultValue="Any Time">
            <option value="Any Time">Any Time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </label>

        <label className="contact-page-field contact-page-field-full">
          <span>
            Message <strong>*</strong>
          </span>

          <textarea
            name="message"
            rows={7}
            placeholder="Tell us how we can help."
            required
          />

          <ValidationError
            className="contact-page-field-error"
            prefix="Message"
            field="message"
            errors={state.errors}
          />
        </label>
      </div>

      {sameDayOrderNotice?.isEnabled && (
        <p className="contact-page-form-note">
          {sameDayOrderNotice.message}
        </p>
      )}

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

      <div className="contact-page-form-status" aria-live="polite">
        {state.succeeded && (
          <p>
            Thank you! Your message has been sent to Ronnie&apos;s Q. We will
            respond as soon as possible.
          </p>
        )}

        {!state.succeeded && state.errors && (
          <ValidationError
            className="contact-page-form-error"
            errors={state.errors}
          />
        )}
      </div>
    </form>
  );
}