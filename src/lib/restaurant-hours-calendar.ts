
import { cache } from "react";
import { getHeaderHours } from "@/lib/restaurant-hours";
import { getPublicSupabaseClient } from "@/lib/supabase-public";

export type HoursMode = "regular" | "special";

type DatabaseScheduleRow = {
  display_mode: HoursMode;
  display_start: string;
  display_end: string;
  schedule_date: string;
  day_name: string;
  holiday_name: string | null;
  is_open: boolean;
  opens_at: string | null;
  closes_at: string | null;
  hours_source: "regular" | "override" | "holiday";
};

export type CalendarHoursDay = {
  key: string;
  label: string;
  hoursText: string;
  isOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
  isSpecial: boolean;
};

export type RestaurantHoursCalendar = {
  mode: HoursMode;
  weekStart: string;
  weekLabel: string;
  regularDays: CalendarHoursDay[];
  specialDays: CalendarHoursDay[];
  today: {
    scheduledOpen: boolean;
    opensAt: string | null;
    closesAt: string | null;
    initialTodayText: string;
  };
};

function getDicksonDateKey(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

function formatTime(value: string): string {
  const [hours, minutes = "00"] = value.split(":");
  const hour = Number(hours);

  return `${hour % 12 || 12}:${minutes}${hour >= 12 ? "pm" : "am"}`;
}

function formatHours(
  isOpen: boolean,
  open: string | null,
  close: string | null,
): string {
  return isOpen && open && close
    ? `${formatTime(open)} to ${formatTime(close)}`
    : "CLOSED";
}

function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    ...options,
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatWeekRange(start: string, end: string): string {
  const startYear = start.slice(0, 4);
  const endYear = end.slice(0, 4);

  if (startYear !== endYear) {
    return `${
      formatDate(start, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } – ${
      formatDate(end, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }`;
  }

  return `${
    formatDate(start, { month: "short", day: "numeric" })
  } – ${
    formatDate(end, { month: "short", day: "numeric" })
  }, ${endYear}`;
}

function getInitialTodayText(
  isOpen: boolean,
  opensAt: string | null,
  closesAt: string | null,
): string {
  if (!isOpen || !opensAt || !closesAt) {
    return "Closed";
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const part = (type: string) =>
    Number(parts.find((x) => x.type === type)?.value ?? "0");

  const nowMinutes = part("hour") * 60 + part("minute");

  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const opening = toMinutes(opensAt);
  const closing = toMinutes(closesAt);

  const openNow =
    closing > opening
      ? nowMinutes >= opening && nowMinutes < closing
      : closing < opening &&
        (nowMinutes >= opening || nowMinutes < closing);

  return openNow
    ? `Open : ${formatTime(opensAt)} to ${formatTime(closesAt)}`
    : "Closed";
}

function getSundayKey(todayKey: string): string {
  const date = new Date(`${todayKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());

  return date.toISOString().slice(0, 10);
}

async function getFallbackCalendar():
  Promise<RestaurantHoursCalendar> {
  const original = await getHeaderHours();
  const todayKey = getDicksonDateKey();
  const weekStart = getSundayKey(todayKey);

  const weekEndDate = new Date(`${weekStart}T12:00:00Z`);
  weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 6);

  const weekEnd = weekEndDate.toISOString().slice(0, 10);

  return {
    mode: "regular",
    weekStart,
    weekLabel: formatWeekRange(weekStart, weekEnd),

    regularDays: original.weeklyDays.map((day) => ({
      key: String(day.dayOfWeek),
      label: day.dayName,
      hoursText: formatHours(
        day.isOpen,
        day.opensAt,
        day.closesAt,
      ),
      isOpen: day.isOpen,
      opensAt: day.opensAt,
      closesAt: day.closesAt,
      isSpecial: false,
    })),

    specialDays: [],

    today: {
      scheduledOpen: original.isOpen,
      opensAt: original.opensAt,
      closesAt: original.closesAt,
      initialTodayText: original.todayText,
    },
  };
}

export const getRestaurantHoursCalendar = cache(
  async (): Promise<RestaurantHoursCalendar> => {
    const supabase = getPublicSupabaseClient();

    if (!supabase) {
      return getFallbackCalendar();
    }

    const { data, error } = await supabase.rpc(
      "get_restaurant_hours_schedule",
    );

    if (error || !data) {
      console.error("Unable to load hours calendar:", error);
      return getFallbackCalendar();
    }

    const rows = data as DatabaseScheduleRow[];

    const regularRows = rows.filter(
      (row) => row.display_mode === "regular",
    );

    const specialRows = rows.filter(
      (row) => row.display_mode === "special",
    );

    if (
      regularRows.length !== 7 ||
      (specialRows.length > 0 && specialRows.length !== 7)
    ) {
      console.error("Unexpected restaurant schedule response");
      return getFallbackCalendar();
    }

    const regularByDate = new Map(
      regularRows.map((row) => [row.schedule_date, row]),
    );

    function makeDay(
      row: DatabaseScheduleRow,
      special: boolean,
    ): CalendarHoursDay {
      const regular = regularByDate.get(row.schedule_date);

      const hasDifferentHours =
        special &&
        Boolean(
          row.holiday_name ||
          (regular &&
            (row.is_open !== regular.is_open ||
              row.opens_at !== regular.opens_at ||
              row.closes_at !== regular.closes_at)),
        );

      return {
        key: row.schedule_date,

        label: special
          ? `${
              formatDate(row.schedule_date, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            }${
              row.holiday_name
                ? ` (${row.holiday_name})`
                : ""
            }`
          : row.day_name,

        hoursText: formatHours(
          row.is_open,
          row.opens_at,
          row.closes_at,
        ),

        isOpen: row.is_open,
        opensAt: row.opens_at,
        closesAt: row.closes_at,
        isSpecial: hasDifferentHours,
      };
    }

    const mode: HoursMode =
      specialRows.length === 7 ? "special" : "regular";

    const activeRows =
      mode === "special" ? specialRows : regularRows;

    const todayRow = activeRows.find(
      (row) => row.schedule_date === getDicksonDateKey(),
    );

    if (!todayRow) {
      return getFallbackCalendar();
    }

    return {
      mode,
      weekStart: rows[0].display_start,
      weekLabel: formatWeekRange(
        rows[0].display_start,
        rows[0].display_end,
      ),

      regularDays: regularRows.map((row) =>
        makeDay(row, false),
      ),

      specialDays: specialRows.map((row) =>
        makeDay(row, true),
      ),

      today: {
        scheduledOpen: todayRow.is_open,
        opensAt: todayRow.opens_at,
        closesAt: todayRow.closes_at,

        initialTodayText: getInitialTodayText(
          todayRow.is_open,
          todayRow.opens_at,
          todayRow.closes_at,
        ),
      },
    };
  },
);
