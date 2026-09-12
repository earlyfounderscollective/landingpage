/**
 * "The Beginner's Guide to Profitable Events" waitlist.
 * Shared by the landing page, the API route, and the confirmation email.
 */
export const ebook = {
  title: "The Beginner’s Guide to Profitable Events",

  // Kit tag applied to everyone who joins, so the launch email can go to
  // this segment only.
  kitTag: "events-guide-waitlist",

  // Default attribution when a signup doesn't pass one.
  defaultSource: "ebook-waitlist",

  // Public route, handy for emails and the sitemap.
  path: "/profitableeventswaitlist",
} as const;
