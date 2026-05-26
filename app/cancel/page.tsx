import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Checkout Cancelled",
};

export default function CancelPage() {
  return (
    <>
      <Header />
      <main className="pt-[180px] md:pt-[220px] pb-28 md:pb-40 bg-ivory grain">
        <div className="container-page">
          <div className="max-w-narrow mx-auto text-center">
            <span className="eyebrow">Checkout Cancelled</span>
            <div className="rule mt-6 mb-10 mx-auto" aria-hidden />
            <h1 className="font-serif text-display-lg text-forest text-balance">
              No worries. Your seat is still held.
            </h1>
            <p className="mt-7 text-[17px] leading-[1.65] text-ink/70 max-w-xl mx-auto">
              Your checkout didn&rsquo;t go through and nothing was charged. If
              you&rsquo;d like to pick it back up later, you can. Or email{" "}
              <a
                href="mailto:contact@earlyfounderscollective.com"
                className="link-underline text-forest"
              >
                contact@earlyfounderscollective.com
              </a>{" "}
              and we&rsquo;ll help.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Link href="/apply" className="btn-primary">Back to application</Link>
              <Link href="/" className="btn-secondary">Home</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
