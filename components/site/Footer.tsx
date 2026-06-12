import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="bg-forest text-ivory relative grain">
      <div className="container-page py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-6 lg:col-span-7">
            <Wordmark tone="ivory" />
            <p className="mt-7 max-w-md text-[17px] md:text-[18px] leading-[1.55] text-ivory/75 font-serif">
              A private community for early-stage business owners built
              around clarity, accountability, and the kind of momentum that
              only comes from being surrounded by people who are actually
              building.
            </p>
            <Link
              href="/apply"
              className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-ivory text-forest px-8 py-[18px] text-[14px] font-medium tracking-[0.02em] transition-all duration-500 ease-editorial hover:bg-bone"
            >
              Apply for Access
            </Link>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ivory/55 mb-5">
              Explore
            </p>
            <ul className="space-y-3 text-[15px]">
              <li>
                <Link
                  href="/#about"
                  className="text-ivory/85 hover:text-ivory transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#what-you-get"
                  className="text-ivory/85 hover:text-ivory transition-colors"
                >
                  What You Get
                </Link>
              </li>
              <li>
                <Link
                  href="/#founder"
                  className="text-ivory/85 hover:text-ivory transition-colors"
                >
                  Founder
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-ivory/85 hover:text-ivory transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/apply"
                  className="text-ivory/85 hover:text-ivory transition-colors"
                >
                  Apply
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ivory/55 mb-5">
              Contact
            </p>
            <a
              href="mailto:contact@earlyfounderscollective.com"
              className="link-underline text-ivory text-[15px] break-all"
            >
              contact@earlyfounderscollective.com
            </a>
            <p className="mt-6 text-[13px] text-ivory/65 leading-[1.6] max-w-xs">
              Applications are reviewed manually. Replies typically within
              2-3 days.
            </p>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-ivory/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[12px] uppercase tracking-[0.28em] text-ivory/55">
            © {new Date().getFullYear()} Early Founders Collective
          </p>
          <div className="flex items-center gap-6 text-[12px] uppercase tracking-[0.28em] text-ivory/55">
            <Link
              href="/privacy"
              className="hover:text-ivory transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-ivory transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
