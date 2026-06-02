import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DiscoveryForm } from "@/components/site/DiscoveryForm";

export const metadata: Metadata = {
  title: "Discovery Call Application · Early Founders Collective",
  description:
    "Complete this application before scheduling a discovery call so we can understand your business, identify where you're stuck, and make the most of our conversation.",
  robots: { index: true, follow: true },
};

export default function DiscoveryCallPage() {
  return (
    <>
      <Header />
      <main>
        <DiscoveryForm />
      </main>
      <Footer />
    </>
  );
}
