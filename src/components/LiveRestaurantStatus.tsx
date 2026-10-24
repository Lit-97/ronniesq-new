"use client";

import {
  useEffect,
  useState,
} from "react";

const RESTAURANT_TIME_ZONE =
  "America/Chicago";

type LiveRestaurantStatusProps = {
  initialTodayText: string;
  scheduledOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
};

function timeToMinutes(
  value: string | null,
): number | null {
  if (!value) {
    return null;
  }

  const [hourText, minuteText = "00"] =
    value.split(":");

  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute)
  ) {
    return null;
  }

  return hour * 60 + minute;
}

function getDicksonTimeInMinutes(): number {
  const formatter = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: RESTAURANT_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    },
  );

  const parts =
    formatter.formatToParts(new Date());

  const hour = Number(
    parts.find(
      (part) => part.type === "hour",
    )?.value ?? "0",
  );

  const minute = Number(
    parts.find(
      (part) => part.type === "minute",
    )?.value ?? "0",
  );

  return hour * 60 + minute;
}

function formatDisplayTime(
  value: string,
): string {
  const [hourText, minuteText = "00"] =
    value.split(":");

  const hour = Number(hourText);
  const suffix = hour >= 12 ? "pm" : "am";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minuteText} ${suffix}`;
}

export type RestaurantLiveStatus = {
  isOpen: boolean;
  statusWord: "Open" | "Closed";
  detail: string;
};

export function getRestaurantLiveStatus(
  scheduledOpen: boolean,
  opensAt: string | null,
  closesAt: string | null,
): RestaurantLiveStatus {
  if (
    !scheduledOpen ||
    !opensAt ||
    !closesAt
  ) {
    return {
      isOpen: false,
      statusWord: "Closed",
      detail: "Closed for the day",
    };
  }

  const openingMinutes =
    timeToMinutes(opensAt);

  const closingMinutes =
    timeToMinutes(closesAt);

  if (
    openingMinutes === null ||
    closingMinutes === null ||
    openingMinutes === closingMinutes
  ) {
    return {
      isOpen: false,
      statusWord: "Closed",
      detail: "Closed for the day",
    };
  }

  const currentMinutes =
    getDicksonTimeInMinutes();

  /*
   * Normal same-day restaurant hours.
   */
  if (closingMinutes > openingMinutes) {
    if (currentMinutes < openingMinutes) {
      return {
        isOpen: false,
        statusWord: "Closed",
        detail: `Opens at ${formatDisplayTime(
          opensAt,
        )}`,
      };
    }

    if (currentMinutes < closingMinutes) {
      return {
        isOpen: true,
        statusWord: "Open",
        detail: `Closes at ${formatDisplayTime(
          closesAt,
        )}`,
      };
    }

    return {
      isOpen: false,
      statusWord: "Closed",
      detail: "Closed for the day",
    };
  }

  /*
   * Overnight hours, if ever needed.
   */
  const openNow =
    currentMinutes >= openingMinutes ||
    currentMinutes < closingMinutes;

  if (openNow) {
    return {
      isOpen: true,
      statusWord: "Open",
      detail: `Closes at ${formatDisplayTime(
        closesAt,
      )}`,
    };
  }

  return {
    isOpen: false,
    statusWord: "Closed",
    detail: `Opens at ${formatDisplayTime(
      opensAt,
    )}`,
  };
}

function buildStatusText(
  scheduledOpen: boolean,
  opensAt: string | null,
  closesAt: string | null,
): string {
  const status = getRestaurantLiveStatus(
    scheduledOpen,
    opensAt,
    closesAt,
  );

  if (!status.isOpen) {
    return "Closed";
  }

  return `Open : ${formatDisplayTime(
    opensAt!,
  )} to ${formatDisplayTime(closesAt!)}`;
}

export default function LiveRestaurantStatus({
  initialTodayText,
  scheduledOpen,
  opensAt,
  closesAt,
}: LiveRestaurantStatusProps) {
  const [todayText, setTodayText] =
    useState(initialTodayText);

  useEffect(() => {
    function updateStatus() {
      setTodayText(
        buildStatusText(
          scheduledOpen,
          opensAt,
          closesAt,
        ),
      );
    }

    updateStatus();

    /*
     * Check often enough that the Header changes within
     * a few seconds of opening or closing time.
     */
    const intervalId = window.setInterval(
      updateStatus,
      10_000,
    );

    window.addEventListener(
      "focus",
      updateStatus,
    );

    document.addEventListener(
      "visibilitychange",
      updateStatus,
    );

    return () => {
      window.clearInterval(intervalId);

      window.removeEventListener(
        "focus",
        updateStatus,
      );

      document.removeEventListener(
        "visibilitychange",
        updateStatus,
      );
    };
  }, [
    scheduledOpen,
    opensAt,
    closesAt,
  ]);

  const openNow =
    todayText.startsWith("Open");

  const statusWord = openNow
    ? "Open"
    : "Closed";

  const remainingText = todayText.slice(
    statusWord.length,
  );

  return (
    <>
      <span
        className={`restaurant-status-word ${
          openNow
            ? "is-open"
            : "is-closed"
        }`}
      >
        {statusWord}
      </span>

      {remainingText}
    </>
  );
}