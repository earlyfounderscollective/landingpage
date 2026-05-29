import { ModuleStub } from "@/components/plan/ModuleStub";

export default function Page() {
  return (
    <ModuleStub
      n="03"
      title="Your Offer"
      desc="What you actually sell. What it solves. Why it's different."
      questions={11}
      tasks={6}
      prevSlug="02-your-market"
      nextSlug="04-your-plan"
    />
  );
}
