/**
 * Centralised page-level VSL URLs. Each page imports its slot.
 *
 * Two videos are *already* admin-editable in /admin (the main training
 * hero VSL via training_event.video_url, and the bootcamp hero VSL via
 * bootcamp_config.video_url). Those don't live here.
 *
 * The constants below are pages without a DB-backed config row yet.
 * Swap a URL here when re-recording. Admin UI for these can come later.
 */
export const SITE_VIDEOS = {
  // /training/confirmed thank-you (different video from /training hero)
  trainingConfirmed: "https://vimeo.com/1204051056",
  // /training/upgrade VIP $17 upsell page
  trainingUpgrade: "https://vimeo.com/1204051040",
  // /kit sales page hero
  kitMain: "https://vimeo.com/1204051067",
  // /bootcamp main hero — fallback when DB value is unavailable
  bootcampMain: "https://vimeo.com/1204051019",
  // /bootcamp/welcome post-purchase page
  bootcampWelcome: "https://vimeo.com/1204050628",
  // /dfy sales page hero
  dfyMain: "https://vimeo.com/1204051254",
} as const;
