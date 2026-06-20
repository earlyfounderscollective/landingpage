/**
 * Helpers for generating Apple / Google / Outlook calendar links from a
 * training event row. Used on /training/confirmed.
 */

function toICalDate(d: Date): string {
  // YYYYMMDDTHHmmssZ
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

export type CalendarParams = {
  title: string;
  startsAt: string; // ISO
  durationMinutes: number;
  description: string;
  location?: string;
};

export function googleCalendarUrl({
  title,
  startsAt,
  durationMinutes,
  description,
  location,
}: CalendarParams): string {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toICalDate(start)}/${toICalDate(end)}`,
    details: description,
    ...(location ? { location } : {}),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl({
  title,
  startsAt,
  durationMinutes,
  description,
  location,
}: CalendarParams): string {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    body: description,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    ...(location ? { location } : {}),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function icsDataUrl({
  title,
  startsAt,
  durationMinutes,
  description,
  location,
}: CalendarParams): string {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Early Founders Collective//Training//EN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@earlyfounderscollective.com`,
    `DTSTAMP:${toICalDate(new Date())}`,
    `DTSTART:${toICalDate(start)}`,
    `DTEND:${toICalDate(end)}`,
    `SUMMARY:${title.replace(/\n/g, " ")}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    ...(location ? [`LOCATION:${location}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
