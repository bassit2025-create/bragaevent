"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CalendarPlus, ChevronDown } from "lucide-react";

type Props = {
  title: string;
  description: string;
  location: string;
  date: string; // ISO string
  startTime: string; // "HH:MM"
  endTime: string | null;
};

function toGoogleDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildDateTimes({ date, startTime, endTime }: Props) {
  const [h, m] = startTime.split(":").map(Number);
  const start = new Date(date);
  start.setHours(h, m, 0, 0);

  let end: Date;
  if (endTime) {
    const [eh, em] = endTime.split(":").map(Number);
    end = new Date(date);
    end.setHours(eh, em, 0, 0);
    if (end <= start) end.setDate(end.getDate() + 1); // crosses midnight
  } else {
    end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // default 2h
  }

  return { start, end };
}

function buildGoogleCalendarUrl(props: Props) {
  const { start, end } = buildDateTimes(props);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: props.title,
    dates: `${toGoogleDate(start)}/${toGoogleDate(end)}`,
    details: props.description,
    location: props.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsFile(props: Props) {
  const { start, end } = buildDateTimes(props);
  const escapeIcs = (text: string) => text.replace(/\n/g, "\\n").replace(/,/g, "\\,");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Braga Event//PT",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}`,
    `DTSTAMP:${toGoogleDate(new Date())}`,
    `DTSTART:${toGoogleDate(start)}`,
    `DTEND:${toGoogleDate(end)}`,
    `SUMMARY:${escapeIcs(props.title)}`,
    `DESCRIPTION:${escapeIcs(props.description)}`,
    `LOCATION:${escapeIcs(props.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return ics;
}

export function AddToCalendarButton(props: Props) {
  const t = useTranslations("eventDetail");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function downloadIcs() {
    const blob = new Blob([buildIcsFile(props)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-sm shadow-accent/20 transition-colors hover:bg-accent-dark active:scale-95"
      >
        <CalendarPlus size={18} />
        {t("addToCalendar")}
        <ChevronDown size={16} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div className="absolute start-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-xl bg-white py-1.5 shadow-xl ring-1 ring-ink/10">
          <a
            href={buildGoogleCalendarUrl(props)}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5"
          >
            {t("googleCalendar")}
          </a>
          <button
            onClick={downloadIcs}
            className="block w-full px-4 py-2.5 text-start text-sm font-semibold text-ink hover:bg-ink/5"
          >
            {t("appleOutlook")}
          </button>
        </div>
      )}
    </div>
  );
}
