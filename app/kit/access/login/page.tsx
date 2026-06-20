import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Build Your Business Kit",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function KitLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; sent?: string };
}) {
  const error = searchParams.error;
  const sent = searchParams.sent === "1";

  return (
    <main className="max-w-[1240px] mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-[460px] mx-auto">
        <p className="text-[10.5px] font-semibold tracking-[0.28em] uppercase text-brass mb-3">
          Build Your Business Kit
        </p>
        <h1 className="font-serif text-[34px] md:text-[40px] leading-[1.1] tracking-[-0.018em] text-forest">
          Sign in to your kit.
        </h1>
        <p className="mt-3 text-[15px] text-ink/72 leading-[1.55]">
          Enter the email you used at checkout. We'll send you a sign-in link
          that works for 30 minutes.
        </p>

        {error === "expired" && (
          <div className="mt-6 rounded-xl border border-[#d23a3a]/30 bg-[#d23a3a]/8 px-4 py-3 text-[13.5px] text-[#9b2828]">
            That link expired or was already used. Enter your email and we'll
            send a fresh one.
          </div>
        )}
        {error === "missing" && (
          <div className="mt-6 rounded-xl border border-[#d23a3a]/30 bg-[#d23a3a]/8 px-4 py-3 text-[13.5px] text-[#9b2828]">
            The link was missing a token. Try requesting a new one.
          </div>
        )}

        {sent ? (
          <div className="mt-8 rounded-2xl border border-forest/20 bg-forest/5 px-5 py-6">
            <p className="font-serif text-[20px] text-forest leading-[1.3]">
              Check your inbox.
            </p>
            <p className="mt-2 text-[14px] text-ink/72 leading-[1.55]">
              If we have an order for that email, the sign-in link is on its
              way. It should arrive in under a minute — check spam if you don't
              see it.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <LoginForm />
          </div>
        )}

        <p className="mt-10 text-[12.5px] text-mute leading-[1.55]">
          Lost the order email or trouble signing in? Reply to your Stripe
          receipt or message{" "}
          <a
            href="mailto:contact@earlyfounderscollective.com"
            className="text-forest underline decoration-brass underline-offset-2"
          >
            contact@earlyfounderscollective.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
