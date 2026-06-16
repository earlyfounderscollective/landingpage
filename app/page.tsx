import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { VideoReviews } from "@/components/site/VideoReviews";
import { LeadMagnet } from "@/components/site/LeadMagnet";
import { Possibility } from "@/components/site/Possibility";
import { RealProblem } from "@/components/site/RealProblem";
import { WhatChanges } from "@/components/site/WhatChanges";
import { Founder } from "@/components/site/Founder";
import { WhatYouGet } from "@/components/site/WhatYouGet";
import { HotSeats } from "@/components/site/HotSeats";
import { Fit } from "@/components/site/Fit";
import { FAQ } from "@/components/site/FAQ";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { StickyApplyButton } from "@/components/site/StickyApplyButton";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pb-[100px] md:pb-0">
        <Hero />
        <VideoReviews />
        <LeadMagnet />
        <Possibility />
        <RealProblem />
        <WhatChanges />
        <Founder />
        <WhatYouGet />
        <HotSeats />
        <Fit />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyApplyButton />
    </>
  );
}
