import Container from "@/components/container";
import { LoadingSpinner } from "@/components/icons";
import { TemplateEditWrapper } from "@/features/template";
import { Suspense } from "react";

export default function TemplateIdPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <Container>
      <div className="relative w-11/12 mx-auto h-full bg-background">
        <Suspense fallback={<LoadingSpinner />}>
          <TemplateEditWrapper id={id} />
        </Suspense>
      </div>
    </Container>
  );
}
