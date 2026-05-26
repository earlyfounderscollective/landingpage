import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { VideoReviews } from "@/components/site/VideoReviews";
import { Possibility } from "@/components/site/Possibility";
import { RealProblem } from "@/components/site/RealProblem";
import { WhatChanges } from "@/components/site/WhatChanges";
import { Founder } from "@/components/site/Founder";
import { WhatYouGet } from "@/components/site/WhatYouGet";
import { Fit } from "@/components/site/Fit";
import { FAQ } from "@/components/site/FAQ";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <VideoReviews />
        <Possibility />
        <RealProblem />
        <WhatChanges />
        <Founder />
        <WhatYouGet />
        <Fit />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
