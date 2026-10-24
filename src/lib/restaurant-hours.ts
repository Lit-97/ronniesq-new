import { DEFAULT_RESTAURANT_HOURS } from "@/data/defaultRestaurantHours";
import { getPublicSupabaseClient } from "@/lib/supabase-public";
import type {
    DayOfWeek,
    HeaderHoursResult,
    RestaurantDayHours,
    RestaurantHoursOverride,
} from "@/types/restaurantHours";

const RESTAURANT_TIME_ZONE = "America/Chicago";
const MILLISECONDS_PER_DAY = 86_400_000;
const OVERRIDE_LOOKAROUND_DAYS = 90;

const DAY_INDEXES: Record<string, DayOfWeek> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

type RestaurantHoursDatabaseRow = {
    day_of_week: number;
    day_name: string;
    is_open: boolean;
    opens_at: string | null;
    closes_at: string | null;
};

type RestaurantOverrideDatabaseRow = {
    override_date: string;
    is_open: boolean;
    opens_at: string | null;
    closes_at: string | null;
    message: string | null;
    show_message_to_customers: boolean;
};


function normalizeDatabaseTime(value: string | null): string | null {
    if (!value) {
        return null;
    }

    return value.slice(0, 5);
}

function formatDisplayTime(value: string | null): string {
    if (!value) {
        return "";
    }

    const [hoursText, minutesText] = value.split(":");
    const hours = Number(hoursText);
    const minutes = minutesText ?? "00";

    if (!Number.isFinite(hours)) {
        return value;
    }

    const suffix = hours >= 12 ? "pm" : "am";
    const twelveHour = hours % 12 || 12;

    return `${twelveHour}:${minutes} ${suffix}`;
}

function getDicksonDateInformation(date: Date): {
    dateKey: string;
    dayOfWeek: DayOfWeek;
} {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: RESTAURANT_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "long",
    });

    const parts = formatter.formatToParts(date);

    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;
    const weekday = parts.find((part) => part.type === "weekday")?.value;

    if (!year || !month || !day || !weekday) {
        throw new Error("Unable to determine the restaurant date.");
    }

    return {
        dateKey: `${year}-${month}-${day}`,
        dayOfWeek: DAY_INDEXES[weekday] ?? 0,
    };
}

function mergeDatabaseHours(
    databaseRows: RestaurantHoursDatabaseRow[],
): RestaurantDayHours[] {
    const databaseHoursByDay = new Map(
        databaseRows.map((row) => [row.day_of_week, row]),
    );

    return DEFAULT_RESTAURANT_HOURS.map((fallbackDay) => {
        const databaseDay = databaseHoursByDay.get(fallbackDay.dayOfWeek);

        if (!databaseDay) {
            return fallbackDay;
        }

        return {
            dayOfWeek: fallbackDay.dayOfWeek,
            dayName: databaseDay.day_name || fallbackDay.dayName,
            shortName: fallbackDay.shortName,
            isOpen: databaseDay.is_open,
            opensAt: normalizeDatabaseTime(databaseDay.opens_at),
            closesAt: normalizeDatabaseTime(databaseDay.closes_at),
        };
    });
}

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
        !Number.isInteger(minute) ||
        hour < 0 ||
        hour > 23 ||
        minute < 0 ||
        minute > 59
    ) {
        return null;
    }

    return hour * 60 + minute;
}

function getDicksonTimeInMinutes(
    date: Date,
): number {
    const formatter = new Intl.DateTimeFormat(
        "en-US",
        {
            timeZone: RESTAURANT_TIME_ZONE,
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        },
    );

    const parts = formatter.formatToParts(date);

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

function isRestaurantOpenAtTime(
    scheduledOpen: boolean,
    opensAt: string | null,
    closesAt: string | null,
    date: Date,
): boolean {
    if (!scheduledOpen) {
        return false;
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
        return false;
    }

    const currentMinutes =
        getDicksonTimeInMinutes(date);

    /*
     * Normal same-day hours:
     * 10:30 am through 7:00 pm
     */
    if (closingMinutes > openingMinutes) {
        return (
            currentMinutes >= openingMinutes &&
            currentMinutes < closingMinutes
        );
    }

    /*
     * Also supports overnight hours, such as:
     * 8:00 pm through 2:00 am
     */
    return (
        currentMinutes >= openingMinutes ||
        currentMinutes < closingMinutes
    );
}

function formatTodayText(
    regularHours: RestaurantDayHours,
    override: RestaurantHoursOverride | null,
    currentDate = new Date(),
): string {
    const scheduledOpen = override
        ? override.isOpen
        : regularHours.isOpen;

    const opensAt = override
        ? override.opensAt
        : regularHours.opensAt;

    const closesAt = override
        ? override.closesAt
        : regularHours.closesAt;

    const openNow = isRestaurantOpenAtTime(
        scheduledOpen,
        opensAt,
        closesAt,
        currentDate,
    );

    if (!openNow) {
        return "Closed";
    }

    return `Open : ${formatDisplayTime(
        opensAt,
    )} to ${formatDisplayTime(closesAt)}`;
}

function buildWeeklyScheduleLines(
    hours: RestaurantDayHours[],
): HeaderHoursResult["weeklyScheduleLines"] {
    const openDays = hours.filter(
        (day) =>
            day.isOpen &&
            day.opensAt &&
            day.closesAt,
    );

    if (openDays.length === 0) {
        return [
            {
                dayLabel: "Regular hours",
                hoursText: "Currently closed",
            },
        ];
    }

    const lines: HeaderHoursResult["weeklyScheduleLines"] =
        [];

    let groupStart = openDays[0];
    let groupEnd = openDays[0];

    function addCurrentGroup() {
        if (
            !groupStart.opensAt ||
            !groupStart.closesAt
        ) {
            return;
        }

        const dayLabel =
            groupStart.dayOfWeek === groupEnd.dayOfWeek
                ? groupStart.dayName
                : `${groupStart.dayName} - ${groupEnd.dayName}`;

        lines.push({
            dayLabel,
            hoursText: `${formatDisplayTime(
                groupStart.opensAt,
            )} - ${formatDisplayTime(
                groupStart.closesAt,
            )}`,
        });
    }

    for (
        let index = 1;
        index < openDays.length;
        index += 1
    ) {
        const currentDay = openDays[index];

        const isNextDay =
            currentDay.dayOfWeek ===
            groupEnd.dayOfWeek + 1;

        const hasMatchingHours =
            currentDay.opensAt === groupStart.opensAt &&
            currentDay.closesAt ===
            groupStart.closesAt;

        if (isNextDay && hasMatchingHours) {
            groupEnd = currentDay;
            continue;
        }

        addCurrentGroup();

        groupStart = currentDay;
        groupEnd = currentDay;
    }

    addCurrentGroup();

    return lines;
}

function formatWeeklySchedule(hours: RestaurantDayHours[]): string {
    const openDays = hours.filter(
        (day) => day.isOpen && day.opensAt && day.closesAt,
    );

    if (openDays.length === 0) {
        return "Currently Closed";
    }

    const firstDay = openDays[0];
    const lastDay = openDays[openDays.length - 1];

    const daysAreConsecutive = openDays.every((day, index) => {
        if (index === 0) {
            return true;
        }

        return day.dayOfWeek === openDays[index - 1].dayOfWeek + 1;
    });

    const allHoursMatch = openDays.every(
        (day) =>
            day.opensAt === firstDay.opensAt &&
            day.closesAt === firstDay.closesAt,
    );

    let dayText: string;

    if (openDays.length === 1) {
        dayText = firstDay.shortName;
    } else if (daysAreConsecutive) {
        dayText = `${firstDay.shortName} - ${lastDay.shortName}`;
    } else {
        dayText = openDays.map((day) => day.shortName).join(", ");
    }

    if (!allHoursMatch || !firstDay.opensAt || !firstDay.closesAt) {
        return `Open ${dayText} : Hours vary by day`;
    }

    return `Open ${dayText} : ${formatDisplayTime(
        firstDay.opensAt,
    )} to ${formatDisplayTime(firstDay.closesAt)}`;
}

function parseDateKey(value: string): Date {
    const [year, month, day] = value
        .split("-")
        .map(Number);

    return new Date(
        Date.UTC(year, month - 1, day),
    );
}

function shiftDateKey(
    value: string,
    numberOfDays: number,
): string {
    const date = parseDateKey(value);

    date.setUTCDate(
        date.getUTCDate() + numberOfDays,
    );

    return date.toISOString().slice(0, 10);
}

function datesAreConsecutive(
    firstDate: string,
    secondDate: string,
): boolean {
    return (
        parseDateKey(secondDate).getTime() -
        parseDateKey(firstDate).getTime() ===
        MILLISECONDS_PER_DAY
    );
}

function overrideRowsMatch(
    first: RestaurantOverrideDatabaseRow,
    second: RestaurantOverrideDatabaseRow,
): boolean {
    return (
        first.is_open === second.is_open &&
        normalizeDatabaseTime(first.opens_at) ===
        normalizeDatabaseTime(second.opens_at) &&
        normalizeDatabaseTime(first.closes_at) ===
        normalizeDatabaseTime(second.closes_at) &&
        first.message === second.message &&
        first.show_message_to_customers ===
        second.show_message_to_customers
    );
}

function formatOverrideRangeLabel(
    startDateKey: string,
    endDateKey: string,
): string {
    const startDate = parseDateKey(startDateKey);
    const endDate = parseDateKey(endDateKey);

    const sameDate = startDateKey === endDateKey;

    const sameYear =
        startDate.getUTCFullYear() ===
        endDate.getUTCFullYear();

    const sameMonth =
        sameYear &&
        startDate.getUTCMonth() ===
        endDate.getUTCMonth();

    const monthAndDayFormatter =
        new Intl.DateTimeFormat("en-US", {
            timeZone: "UTC",
            month: "long",
            day: "numeric",
        });

    if (sameDate) {
        return monthAndDayFormatter.format(startDate);
    }

    if (sameMonth) {
        const startText =
            monthAndDayFormatter.format(startDate);

        const endDay = endDate.getUTCDate();

        return `${startText} – ${endDay}`;
    }

    if (sameYear) {
        return `${monthAndDayFormatter.format(
            startDate,
        )} – ${monthAndDayFormatter.format(
            endDate,
        )}`;
    }

    const monthDayYearFormatter =
        new Intl.DateTimeFormat("en-US", {
            timeZone: "UTC",
            month: "long",
            day: "numeric",
            year: "numeric",
        });

    return `${monthDayYearFormatter.format(
        startDate,
    )} – ${monthDayYearFormatter.format(endDate)}`;
}

export async function getHeaderHours(): Promise<HeaderHoursResult> {
    const { dateKey, dayOfWeek } = getDicksonDateInformation(new Date());

    let weeklyHours = DEFAULT_RESTAURANT_HOURS;
    let override: RestaurantHoursOverride | null = null;
    let specialDateLabel: string | null = null;
    let source: HeaderHoursResult["source"] = "fallback";

    const supabase = getPublicSupabaseClient();

    if (supabase) {
        try {

            const overrideWindowStart = shiftDateKey(
                dateKey,
                -OVERRIDE_LOOKAROUND_DAYS,
            );

            const overrideWindowEnd = shiftDateKey(
                dateKey,
                OVERRIDE_LOOKAROUND_DAYS,
            );

            const [weeklyResponse, overrideResponse] = await Promise.all([
                supabase
                    .from("restaurant_hours")
                    .select(
                        "day_of_week, day_name, is_open, opens_at, closes_at",
                    )
                    .order("day_of_week", { ascending: true }),

                supabase
                    .from("restaurant_hour_overrides")
                    .select(
                        "override_date, is_open, opens_at, closes_at, message, show_message_to_customers",
                    )
                    .gte("override_date", overrideWindowStart)
                    .lte("override_date", overrideWindowEnd)
                    .order("override_date", {
                        ascending: true,
                    }),
            ]);

            if (
                !weeklyResponse.error &&
                weeklyResponse.data &&
                weeklyResponse.data.length > 0
            ) {
                weeklyHours = mergeDatabaseHours(
                    weeklyResponse.data as RestaurantHoursDatabaseRow[],
                );

                source = "supabase";
            }

            if (
                !overrideResponse.error &&
                overrideResponse.data
            ) {
                const overrideRows =
                    overrideResponse.data as RestaurantOverrideDatabaseRow[];

                const currentOverrideIndex =
                    overrideRows.findIndex(
                        (row) => row.override_date === dateKey,
                    );

                if (currentOverrideIndex !== -1) {
                    const databaseOverride =
                        overrideRows[currentOverrideIndex];

                    override = {
                        overrideDate:
                            databaseOverride.override_date,

                        isOpen: databaseOverride.is_open,

                        opensAt: normalizeDatabaseTime(
                            databaseOverride.opens_at,
                        ),

                        closesAt: normalizeDatabaseTime(
                            databaseOverride.closes_at,
                        ),

                        message: databaseOverride.message,

                        showMessageToCustomers:
                            databaseOverride.show_message_to_customers,
                    };

                    let rangeStartIndex =
                        currentOverrideIndex;

                    let rangeEndIndex =
                        currentOverrideIndex;

                    while (rangeStartIndex > 0) {
                        const previousRow =
                            overrideRows[rangeStartIndex - 1];

                        const currentRow =
                            overrideRows[rangeStartIndex];

                        if (
                            !datesAreConsecutive(
                                previousRow.override_date,
                                currentRow.override_date,
                            ) ||
                            !overrideRowsMatch(
                                previousRow,
                                currentRow,
                            )
                        ) {
                            break;
                        }

                        rangeStartIndex -= 1;
                    }

                    while (
                        rangeEndIndex <
                        overrideRows.length - 1
                    ) {
                        const currentRow =
                            overrideRows[rangeEndIndex];

                        const nextRow =
                            overrideRows[rangeEndIndex + 1];

                        if (
                            !datesAreConsecutive(
                                currentRow.override_date,
                                nextRow.override_date,
                            ) ||
                            !overrideRowsMatch(
                                currentRow,
                                nextRow,
                            )
                        ) {
                            break;
                        }

                        rangeEndIndex += 1;
                    }

                    specialDateLabel =
                        formatOverrideRangeLabel(
                            overrideRows[rangeStartIndex]
                                .override_date,

                            overrideRows[rangeEndIndex]
                                .override_date,
                        );
                }
            }
        } catch (error) {

            console.error("Unable to load restaurant hours:", error);
        }
    }

    const todayHours =
        weeklyHours.find((day) => day.dayOfWeek === dayOfWeek) ??
        DEFAULT_RESTAURANT_HOURS[dayOfWeek];

    const activeIsOpen = override
        ? override.isOpen
        : todayHours.isOpen;

    const activeOpensAt = override
        ? override.opensAt
        : todayHours.opensAt;

    const activeClosesAt = override
        ? override.closesAt
        : todayHours.closesAt;

    const isOpenWithHours = Boolean(
        activeIsOpen &&
        activeOpensAt &&
        activeClosesAt,


    );



    const hoursText =
        activeIsOpen &&
            activeOpensAt &&
            activeClosesAt
            ? `${formatDisplayTime(
                activeOpensAt,
            )} to ${formatDisplayTime(
                activeClosesAt,
            )}`
            : "Closed for the day";

    return {
        todayText: formatTodayText(
            todayHours,
            override,
        ),

        weeklyText:
            formatWeeklySchedule(weeklyHours),

        weeklyScheduleLines:
            buildWeeklyScheduleLines(weeklyHours),

        weeklyDays: weeklyHours,    

        dayName: todayHours.dayName,

        /*
         * Keep this as the scheduled status so the Contact
         * section can still display today's special schedule.
         */
        isOpen: isOpenWithHours,

        hoursText,

        opensAt: activeOpensAt,
        closesAt: activeClosesAt,

        hasTodayOverride: override !== null,
        specialDateLabel,

        customerMessage:
            override?.showMessageToCustomers &&
                override.message
                ? override.message
                : null,

        source,
    };
}