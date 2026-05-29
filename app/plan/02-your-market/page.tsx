import { ModuleStub } from "@/components/plan/ModuleStub";

export default function Page() {
  return (
    <ModuleStub
      n="02"
      title="Your Market"
      desc="Who you're really for. Who else is there. Where the opening is."
      questions={7}
      tasks={4}
      prevSlug="01-your-brand"
      nextSlug="03-your-offer"
    />
  );
}
