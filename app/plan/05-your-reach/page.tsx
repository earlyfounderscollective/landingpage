import { ModuleStub } from "@/components/plan/ModuleStub";

export default function Page() {
  return (
    <ModuleStub
      n="05"
      title="Your Reach"
      desc="Where you'll be found. Two channels done well beats five done badly."
      questions={7}
      tasks={6}
      prevSlug="04-your-plan"
      nextSlug="06-your-funnel"
    />
  );
}
