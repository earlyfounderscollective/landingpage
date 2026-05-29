import { ModuleStub } from "@/components/plan/ModuleStub";

export default function Page() {
  return (
    <ModuleStub
      n="04"
      title="Your Plan"
      desc="The operating doc. Vision, goals, money, team, risk."
      questions={10}
      tasks={6}
      prevSlug="03-your-offer"
      nextSlug="05-your-reach"
    />
  );
}
