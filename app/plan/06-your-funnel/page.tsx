import { ModuleStub } from "@/components/plan/ModuleStub";

export default function Page() {
  return (
    <ModuleStub
      n="06"
      title="Your Funnel"
      desc="The path from stranger to customer. Top, middle, bottom of funnel."
      questions={8}
      tasks={6}
      prevSlug="05-your-reach"
      nextSlug="07-your-retention"
    />
  );
}
