import {
  googleCalendarUrl,
  outlookCalendarUrl,
  icsDataUrl,
  type CalendarParams,
} from "@/lib/calendar-links";

export function CalendarButtons(props: CalendarParams) {
  const google = googleCalendarUrl(props);
  const outlook = outlookCalendarUrl(props);
  const ics = icsDataUrl(props);

  return (
    <div className="flex flex-col items-center gap-3 max-w-[280px] mx-auto w-full">
      <a
        href={ics}
        download="early-founders-training.ics"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brass text-ivory text-[14px] font-medium tracking-[0.02em] px-6 py-[14px] hover:bg-[#8a6c3f] transition-colors"
      >
        <CalIcon /> Apple Calendar
      </a>
      <a
        href={google}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brass text-ivory text-[14px] font-medium tracking-[0.02em] px-6 py-[14px] hover:bg-[#8a6c3f] transition-colors"
      >
        <CalIcon /> Google Calendar
      </a>
      <a
        href={outlook}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brass text-ivory text-[14px] font-medium tracking-[0.02em] px-6 py-[14px] hover:bg-[#8a6c3f] transition-colors"
      >
        <CalIcon /> Outlook Calendar
      </a>
    </div>
  );
}

function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="1" y1="5.5" x2="13" y2="5.5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="4" y1="1" x2="4" y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
