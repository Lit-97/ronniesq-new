export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type RestaurantDayHours = {
  dayOfWeek: DayOfWeek;
  dayName: string;
  shortName: string;
  isOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
};

export type RestaurantHoursOverride = {
  overrideDate: string;
  isOpen: boolean;
  showMessageToCustomers: boolean;
  opensAt: string | null;
  closesAt: string | null;
  message: string | null;
};

export type HeaderHoursResult = {
  todayText: string;
  weeklyText: string;

  weeklyDays: Array<{
    dayOfWeek: number;
    dayName: string;
    isOpen: boolean;
    opensAt: string | null;
    closesAt: string | null;
  }>;

  dayName: string;
  isOpen: boolean;
  hoursText: string;

  opensAt: string | null;
  closesAt: string | null;

  weeklyScheduleLines: Array<{
    dayLabel: string;
    hoursText: string;
  }>;

  hasTodayOverride: boolean;
  specialDateLabel: string | null;
  customerMessage: string | null;

  source: "supabase" | "fallback";
};