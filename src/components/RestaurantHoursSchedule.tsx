
"use client";

import { useEffect, useState } from "react";

import type {
  HoursMode,
  RestaurantHoursCalendar,
} from "@/lib/restaurant-hours-calendar";

type Props = {
  calendar: RestaurantHoursCalendar;
};

export default function RestaurantHoursSchedule({
  calendar,
}: Props) {
  const [selected, setSelected] =
    useState<HoursMode>(calendar.mode);

  useEffect(() => {
    setSelected(calendar.mode);
  }, [calendar.mode, calendar.weekStart]);

  const showingSpecial =
    calendar.mode === "special" &&
    selected === "special";

  const days = showingSpecial
    ? calendar.specialDays
    : calendar.regularDays;

  return (
    <section
      className="ronnie-hours"
      aria-label="Restaurant hours"
    >
      {calendar.mode === "special" && (
        <div
          className="ronnie-hours__toggle"
          role="group"
          aria-label="Select hours schedule"
        >
          <button
            type="button"
            className={showingSpecial ? "is-active" : ""}
            aria-pressed={showingSpecial}
            onClick={() => setSelected("special")}
          >
            Special Hours
          </button>

          <button
            type="button"
            className={!showingSpecial ? "is-active" : ""}
            aria-pressed={!showingSpecial}
            onClick={() => setSelected("regular")}
          >
            Regular Hours
          </button>
        </div>
      )}

      <h3 className="ronnie-hours__title">
        {showingSpecial ? "Special Hours" : "Regular Hours"}
      </h3>

      {showingSpecial && (
        <p className="ronnie-hours__range">
          {calendar.weekLabel}
        </p>
      )}

      <div
        className="ronnie-hours__days"
        aria-live="polite"
        aria-atomic="true"
      >
        {days.map((day) => (
          <div
            className={`ronnie-hours__row${
              day.isSpecial ? " is-special" : ""
            }`}
            key={day.key}
          >
            <span>{day.label}</span>

            <strong
              className={
                day.isOpen ? undefined : "is-closed"
              }
            >
              {day.hoursText}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
