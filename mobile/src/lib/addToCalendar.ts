import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

export type CalendarEventInput = {
  title: string;
  notes: string;
  location: string;
  date: string; // ISO date
  startTime: string; // "HH:MM"
  endTime: string | null;
};

function buildDateTimes({ date, startTime, endTime }: CalendarEventInput) {
  const [h, m] = startTime.split(':').map(Number);
  const start = new Date(date);
  start.setHours(h, m, 0, 0);

  let end: Date;
  if (endTime) {
    const [eh, em] = endTime.split(':').map(Number);
    end = new Date(date);
    end.setHours(eh, em, 0, 0);
    if (end <= start) end.setDate(end.getDate() + 1);
  } else {
    end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  }

  return { start, end };
}

async function getWritableCalendarId(): Promise<string | null> {
  if (Platform.OS === 'ios') {
    const defaultCalendar = Calendar.getDefaultCalendarSync();
    return defaultCalendar?.id ?? null;
  }

  const calendars = await Calendar.getCalendars(Calendar.EntityTypes.EVENT);
  const writable =
    calendars.find((c) => c.allowsModifications && c.isPrimary) ??
    calendars.find((c) => c.allowsModifications);
  return writable?.id ?? null;
}

/**
 * Adds an event to the user's default device calendar. Returns true on
 * success, false if permission was denied or no writable calendar was
 * found.
 */
export async function addEventToDeviceCalendar(input: CalendarEventInput): Promise<boolean> {
  const { status } = await Calendar.requestCalendarPermissions();
  if (status !== 'granted') return false;

  const calendarId = await getWritableCalendarId();
  if (!calendarId) return false;

  const { start, end } = buildDateTimes(input);

  const calendar = await Calendar.ExpoCalendar.get(calendarId);
  await calendar.createEvent({
    title: input.title,
    notes: input.notes,
    location: input.location,
    startDate: start,
    endDate: end,
    timeZone: undefined,
  });

  return true;
}
