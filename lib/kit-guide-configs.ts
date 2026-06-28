import type { GuideConfig } from "@/components/kit/GuideModule";

export const BRANDING_GUIDE: GuideConfig = {
  slug: "11-branding",
  decisions: [
    {
      id: "name_path",
      question: "Are you launching with your legal name or a DBA?",
      hint: "If you've already filed an LLC under a business name, that's your DBA. If you want to use a different name publicly, you'll register that as a DBA / 'doing business as.'",
      options: [
        {
          value: "personal_brand",
          label: "Personal brand — my name",
          sub: "Best when you're the product: consultants, coaches, creators.",
        },
        {
          value: "business_brand",
          label: "Business name (DBA)",
          sub: "Best when the brand should outgrow you eventually.",
          recommended: true,
        },
      ],
    },
    {
      id: "logo_path",
      question: "How are you sourcing your logo?",
      hint: "Skip the $5K agency. The 80% solution gets you launched.",
      options: [
        {
          value: "ideogram",
          label: "Ideogram AI",
          sub: "Free tier. The AI image tool that actually renders letters correctly — most others mangle text. Type your business name + a style and iterate.",
          recommended: true,
        },
        {
          value: "canva_diy",
          label: "DIY in Canva",
          sub: "Free. Good wordmarks for most service businesses if you have any design instinct.",
        },
        {
          value: "fiverr",
          label: "$40 designer on Fiverr",
          sub: "Search 'minimal wordmark logo'. 48-hour turnaround.",
        },
        {
          value: "ai_generator",
          label: "Looka / Brandmark",
          sub: "$20-50. Older AI logo generators. Decent backup if Ideogram doesn't click.",
        },
      ],
    },
  ],
  steps: [
    {
      title: "The 4 brand assets",
      description: "If you have these four, you can ship anything else.",
      steps: [
        { id: "asset-name", label: "Lock the business name + check it's available on IG, .com, and your state's DBA registry" },
        { id: "asset-logo", label: "Create a wordmark logo (the business name in a clean type) — PNG with transparent background" },
        { id: "asset-palette", label: "Pick 3 colors max — one dark, one light, one accent. Write down the hex codes." },
        { id: "asset-voice", label: "Write 3 sentences describing how your brand talks (e.g. 'direct, no fluff, no exclamation marks')." },
      ],
    },
    {
      title: "Where to store your assets",
      description: "Centralize so you can find them when you need them.",
      steps: [
        { id: "store-folder", label: "Create one 'Brand Assets' folder in Google Drive / Dropbox / Notion" },
        { id: "store-logo-variants", label: "Save logo in 3 variants: black, white, and color — PNG + SVG" },
        { id: "store-profile-pics", label: "Generate a 320×320 profile picture version (for IG / Stripe / Gmail signature)" },
        { id: "store-banner", label: "Generate a 1500×500 banner version (Twitter/LinkedIn headers)" },
      ],
    },
    {
      title: "Where to actually use the brand",
      steps: [
        { id: "use-ig", label: "Update Instagram bio picture + bio copy" },
        { id: "use-stripe", label: "Add logo to your Stripe account → public business profile" },
        { id: "use-email", label: "Add wordmark + tagline to your email signature" },
        { id: "use-website", label: "Use it on your one-page site (see Module 12)" },
      ],
    },
  ],
  tools: [
    {
      title: "Recommended tools",
      tools: [
        { name: "Ideogram AI", url: "https://ideogram.ai", tag: "Free tier", why: "The AI image tool that actually renders letters correctly. Type your business name + a style direction (e.g. 'minimal brass wordmark, italic serif'), iterate 3-4 times, and you'll have a usable logo in under 10 min." },
        { name: "Canva", url: "https://canva.com", tag: "Free", why: "Logo + profile pics + banners + business cards. The 'one tool to rule them all' for non-designers." },
        { name: "Coolors", url: "https://coolors.co", tag: "Free", why: "Generate a 3-color palette in 10 seconds. Lock the one you like and copy the hex codes." },
        { name: "Fontshare", url: "https://fontshare.com", tag: "Free", why: "Premium fonts, free for commercial use. Pair one serif + one sans. Done." },
        { name: "Brandbird", url: "https://brandbird.app", tag: "$8/mo", why: "Mockup generator. Drop your logo on a phone/laptop in seconds for IG posts." },
      ],
    },
  ],
  closing:
    "Your brand is not your logo — it's the consistent feeling people get when they interact with you. Get to 'good enough' here in one day, then put 95% of your time into Module 05 (First 30 Customers). The customers don't care about your hex codes — they care that you show up consistently.",
};

export const WEBSITE_GUIDE: GuideConfig = {
  slug: "12-website",
  decisions: [
    {
      id: "site_scope",
      question: "How many pages do you need on day one?",
      hint: "Most early founders waste 3+ weeks building a 7-page site that nobody reads.",
      options: [
        {
          value: "one_page",
          label: "One-page site",
          sub: "Hero + offer + proof + booking. Done in a weekend.",
          recommended: true,
        },
        {
          value: "multi_page",
          label: "Multi-page (3-5 pages)",
          sub: "Only if you have multiple services with very different audiences.",
        },
      ],
    },
    {
      id: "builder_choice",
      question: "What builder will you use?",
      hint: "Stop researching. Pick one of these and ship.",
      options: [
        {
          value: "squarespace",
          label: "Squarespace",
          sub: "$23/mo. Best for service businesses + portfolios. Beautiful templates.",
          recommended: true,
        },
        {
          value: "framer",
          label: "Framer",
          sub: "Free tier. Best look + feel of any modern builder. Steeper learning curve.",
        },
        {
          value: "carrd",
          label: "Carrd",
          sub: "$19/yr. Best for true one-page sites. Almost zero learning curve.",
        },
      ],
    },
  ],
  steps: [
    {
      title: "The 5 sections every founder site needs",
      description:
        "In this order. If a section doesn't fit one of these jobs, cut it.",
      steps: [
        { id: "section-hero", label: "Hero — one-sentence offer (from Module 01) + a single CTA button" },
        { id: "section-who", label: "Who it's for — the customer recognises themselves" },
        { id: "section-outcome", label: "Outcome — what changes for them after buying. Specific. Time-bound." },
        { id: "section-proof", label: "Proof — testimonial, photo, screenshot, before/after, client name + logo" },
        { id: "section-cta", label: "Call to action — booking link, contact form, or buy button. ONE option only." },
      ],
    },
    {
      title: "Pre-launch checklist",
      steps: [
        { id: "pre-mobile", label: "View it on your phone — mobile-first, not desktop-first" },
        { id: "pre-typos", label: "Read every word out loud. Catch typos and awkward phrasing." },
        { id: "pre-load", label: "Run a Google PageSpeed test — aim for 80+ on mobile", link: { label: "PageSpeed Insights", href: "https://pagespeed.web.dev" } },
        { id: "pre-favicon", label: "Add your favicon (the tiny tab icon)" },
        { id: "pre-og", label: "Set the social-share image (the preview when someone pastes your link)" },
        { id: "pre-analytics", label: "Add Plausible / Fathom (privacy-friendly analytics, no cookie banner)" },
      ],
    },
    {
      title: "After launch",
      steps: [
        { id: "post-share", label: "Post the launch on IG / LinkedIn / your top channel" },
        { id: "post-bio", label: "Update your bio link everywhere (IG, Twitter, email signature)" },
        { id: "post-google", label: "Submit your site to Google Search Console for indexing" },
        { id: "post-iterate", label: "Block 30 min every Sunday for the first month to tweak based on feedback" },
      ],
    },
  ],
  closing:
    "Your site won't make you money. Your outreach will. Spend 1 weekend on the site, then redirect all that energy into Modules 05 (First 30) and 09 (Weekly Planner). The site exists so the customer who's already decided to buy can find the link.",
};

export const DOMAIN_GUIDE: GuideConfig = {
  slug: "13-domain",
  decisions: [
    {
      id: "domain_ext",
      question: "Which extension should you use?",
      hint: "The .com debate ends here.",
      options: [
        {
          value: "dotcom",
          label: ".com",
          sub: "Always preferred. Most trusted. If yours is taken, change the name — don't settle for .co or .biz.",
          recommended: true,
        },
        {
          value: "dotco",
          label: ".co",
          sub: "Acceptable backup if .com is parked and selling for $5K+.",
        },
        {
          value: "dotme",
          label: ".me / .io / .xyz",
          sub: "Only OK for tech / personal brand sites. Service businesses should NOT use these — your customer's parent will type .com.",
        },
      ],
    },
    {
      id: "registrar",
      question: "Where should you register?",
      hint: "Stop using GoDaddy. They upsell aggressively and overcharge on renewals.",
      options: [
        {
          value: "namecheap",
          label: "Namecheap",
          sub: "$10/yr typical. Free WHOIS privacy. Cleanest UI for non-techies.",
          recommended: true,
        },
        {
          value: "cloudflare",
          label: "Cloudflare Registrar",
          sub: "Best price (~$9/yr, at-cost). No upsells. Slightly more technical UI.",
        },
        {
          value: "porkbun",
          label: "Porkbun",
          sub: "$8/yr typical. Friendly UI. Free WHOIS privacy.",
        },
      ],
    },
  ],
  steps: [
    {
      title: "5 settings to lock down on day one",
      description: "These are the security + sanity settings most founders skip.",
      steps: [
        { id: "lock-privacy", label: "Turn ON WHOIS privacy — hides your home address from public records (free on Namecheap, Cloudflare, Porkbun)" },
        { id: "lock-autorenew", label: "Turn ON auto-renew — losing your domain because of a missed renewal email is one of the worst self-inflicted founder injuries" },
        { id: "lock-mfa", label: "Turn ON 2-factor authentication on the registrar account" },
        { id: "lock-transfer", label: "Turn ON registrar transfer lock — prevents someone from stealing the domain" },
        { id: "lock-dns", label: "Confirm DNS is pointing where you want (your site builder usually gives you the records to add)" },
      ],
    },
    {
      title: "DNS basics — what each record does",
      steps: [
        { id: "dns-a", label: "A record — points your domain to an IP address (you'll rarely set this directly)" },
        { id: "dns-cname", label: "CNAME — points your domain to another domain (e.g. 'yourname.com' → 'sites.squarespace.com'). Most builders ask for this." },
        { id: "dns-mx", label: "MX record — routes email. Set these when you set up business email (see Module 14)" },
        { id: "dns-txt", label: "TXT record — used for email verification (SPF, DKIM, DMARC) — your email provider tells you what to paste" },
      ],
    },
    {
      title: "Pointing your domain at a site",
      steps: [
        { id: "point-builder", label: "In your site builder (Squarespace / Framer / etc.), find 'Connect Custom Domain'" },
        { id: "point-copy", label: "Copy the DNS records they give you" },
        { id: "point-paste", label: "Paste them into your registrar's DNS panel" },
        { id: "point-wait", label: "Wait. DNS changes can take 30 min to 48 hrs to propagate. Usually under an hour." },
        { id: "point-verify", label: "Check it: visit yourdomain.com in an incognito tab. If it shows your site, you're done." },
      ],
    },
  ],
  tools: [
    {
      title: "Tools you'll need",
      tools: [
        { name: "Namecheap", url: "https://namecheap.com", tag: "Recommended", why: "Where to actually buy your domain. Avoid GoDaddy." },
        { name: "DNSChecker", url: "https://dnschecker.org", tag: "Free", why: "Paste your domain to see how DNS changes have propagated globally. Useful when 'it's not working' but actually is — just hasn't reached you yet." },
        { name: "Mailtester", url: "https://mailtester.com", tag: "Free", why: "Test that your email is set up correctly (SPF, DKIM, DMARC all green) once you wire it up." },
      ],
    },
  ],
  closing:
    "Buy your domain TODAY, even if your site isn't ready. Squatters and bots scrape new business filings constantly. The domain is the cheapest insurance you'll ever buy for your brand.",
};

export const EMAIL_GUIDE: GuideConfig = {
  slug: "14-business-email",
  decisions: [
    {
      id: "email_provider",
      question: "Which email provider should you use?",
      hint: "All three host hello@yourdomain.com. The difference is what comes bundled.",
      options: [
        {
          value: "google",
          label: "Google Workspace",
          sub: "$7/user/mo. Gmail interface + Drive + Docs + Calendar. What 90% of small businesses use.",
          recommended: true,
        },
        {
          value: "zoho",
          label: "Zoho Mail",
          sub: "Free for 1 user (5GB). Cheaper if you're solo and don't need Google Docs.",
        },
        {
          value: "fastmail",
          label: "Fastmail",
          sub: "$3/user/mo. Privacy-first. No Google account required. Good for tech-savvy founders.",
        },
      ],
    },
    {
      id: "inbox_strategy",
      question: "How will you handle incoming mail?",
      options: [
        {
          value: "one_inbox",
          label: "One main inbox: hello@yourdomain.com",
          sub: "Best for solo founders. All mail goes here, you filter by labels.",
          recommended: true,
        },
        {
          value: "multiple",
          label: "Multiple aliases: hello@, support@, billing@",
          sub: "All forward to your main inbox. Looks more established. Free.",
        },
      ],
    },
  ],
  steps: [
    {
      title: "Setup flow (45 min)",
      description: "Order matters — domain has to exist before you can hook up email.",
      steps: [
        { id: "email-domain", label: "Domain registered (Module 13)" },
        { id: "email-signup", label: "Sign up for your chosen provider (Google Workspace / Zoho / Fastmail)" },
        { id: "email-verify", label: "Provider asks you to verify domain ownership — add a TXT record at your registrar" },
        { id: "email-mx", label: "Add the MX records the provider gives you to your domain DNS" },
        { id: "email-test", label: "Send yourself a test email from a Gmail account → check it arrives in your business inbox" },
        { id: "email-reply", label: "Reply from the business inbox → check it lands in the Gmail" },
      ],
    },
    {
      title: "Deliverability — the unsexy must-do",
      description: "Without these 3 DNS records, your emails go to spam.",
      steps: [
        { id: "deliv-spf", label: "SPF record — tells the world which servers can send mail as you" },
        { id: "deliv-dkim", label: "DKIM record — cryptographic signature on every email you send" },
        { id: "deliv-dmarc", label: "DMARC record — tells servers what to do with mail that fails SPF/DKIM" },
        { id: "deliv-test", label: "Test all three at mail-tester.com — score 8/10+ before sending real customer mail", link: { label: "mail-tester.com", href: "https://mail-tester.com" } },
      ],
    },
    {
      title: "The 3 things every business email needs",
      steps: [
        { id: "ext-signature", label: "Email signature with name, title, business, phone, and one link (booking / site)" },
        { id: "ext-mobile", label: "Set up the inbox on your phone with notifications on" },
        { id: "ext-autoreply", label: "Set an auto-responder for first-time senders ('Thanks for reaching out — I read every message…')" },
      ],
    },
  ],
  tools: [
    {
      title: "Recommended tools",
      tools: [
        { name: "Google Workspace", url: "https://workspace.google.com", tag: "$7/mo", why: "Default for a reason. Just works." },
        { name: "mail-tester.com", url: "https://mail-tester.com", tag: "Free", why: "Send an email to the address they give you. Get a score 0-10 on deliverability. Fix anything below 8." },
        { name: "MXToolbox", url: "https://mxtoolbox.com", tag: "Free", why: "Look up your MX records, SPF, DKIM, DMARC. Diagnose 'why isn't my email working.'" },
      ],
    },
  ],
  closing:
    "Customers will Google you. They will email you. The address you reply from is part of your brand. If it's gmail.com you're saying 'I'm not serious yet.' One hour today fixes that for years.",
};

export const GBP_GUIDE: GuideConfig = {
  slug: "15-google-business-profile",
  decisions: [
    {
      id: "have_storefront",
      question: "Do you have a physical location customers visit?",
      hint: "Google handles 'service area' businesses differently from storefronts.",
      options: [
        {
          value: "yes_storefront",
          label: "Yes — customers come to my location",
          sub: "Restaurants, retail, salons, studios.",
        },
        {
          value: "service_area",
          label: "No — I go to them OR work remotely",
          sub: "Contractors, photographers, consultants, mobile services.",
          recommended: true,
        },
      ],
    },
  ],
  steps: [
    {
      title: "Setup (30 min)",
      steps: [
        { id: "gbp-create", label: "Go to business.google.com → 'Manage now'", link: { label: "business.google.com", href: "https://business.google.com" } },
        { id: "gbp-name", label: "Enter your exact business name (must match your LLC if you have one)" },
        { id: "gbp-category", label: "Pick your primary category — be specific (e.g. 'Brand Photographer', not 'Photographer')" },
        { id: "gbp-address", label: "Add your address OR check 'I deliver goods and services to my customers' for service-area" },
        { id: "gbp-area", label: "Service area: list zip codes / cities within your service radius" },
        { id: "gbp-phone", label: "Add phone number + your business email" },
        { id: "gbp-website", label: "Add your website URL (Module 12)" },
        { id: "gbp-verify", label: "Verify — Google sends a postcard, a phone code, or asks for a video tour. Postcard takes 5-14 days." },
      ],
    },
    {
      title: "Day one — fill it out completely",
      description: "A complete profile gets ~7x more clicks than a sparse one.",
      steps: [
        { id: "fill-photos", label: "Upload 10+ photos: logo, exterior (if applicable), team, completed work, behind-the-scenes" },
        { id: "fill-hours", label: "Set business hours (and special hours for holidays)" },
        { id: "fill-services", label: "Add ALL your services as separate line items with prices if appropriate" },
        { id: "fill-description", label: "Write a 750-character business description — include your primary keywords naturally" },
        { id: "fill-attributes", label: "Set attributes: 'Black-owned', 'Women-owned', 'LGBTQ+ friendly', payment methods, accessibility" },
      ],
    },
    {
      title: "First 5 reviews — the most important early move",
      description: "5 reviews is the threshold where you start ranking. Get them fast.",
      steps: [
        { id: "reviews-link", label: "Copy your review link from your GBP dashboard (the share button)" },
        { id: "reviews-past", label: "Text 10 past customers/clients — ask 'Would you mind dropping a one-sentence review?'" },
        { id: "reviews-template", label: "Send them the link + a script: 'Just a sentence about what we did and how it went.'" },
        { id: "reviews-respond", label: "Reply to EVERY review within 24 hours (even one-line replies). Google ranks responsiveness." },
        { id: "reviews-ongoing", label: "After each new client, send the review link. Build the habit." },
      ],
    },
    {
      title: "Ongoing — what to post weekly",
      description: "Google ranks active profiles. 5 min/week of posting compounds.",
      steps: [
        { id: "post-update", label: "1 post per week — a project, an offer, a customer win, a tip" },
        { id: "post-events", label: "Promote any in-person events using the Events feature" },
        { id: "post-offer", label: "Use the 'Offer' post type to highlight specials with start/end dates" },
        { id: "post-qa", label: "Answer the 'Questions' section monthly — anyone can ask, you can pre-seed common ones" },
      ],
    },
  ],
  tools: [
    {
      title: "Companion tools",
      tools: [
        { name: "Google Business Profile", url: "https://business.google.com", tag: "Free", why: "The thing itself. Manage from web or the GBP mobile app." },
        { name: "GBP Mobile App", url: "https://play.google.com/store/apps/details?id=com.google.android.apps.maps", tag: "Free", why: "Reply to reviews + post updates from your phone. Crucial for the response-time ranking signal." },
        { name: "PlePer", url: "https://pleper.com", tag: "Free", why: "Free GBP audit tool — tells you exactly what's missing on your profile." },
      ],
    },
  ],
  closing:
    "GBP is the cheapest, fastest path to local-search visibility — and it's free forever. Most of your competitors have set theirs up once and forgotten about it. Update yours weekly and you'll outrank businesses that have been operating for 10+ years.",
};
