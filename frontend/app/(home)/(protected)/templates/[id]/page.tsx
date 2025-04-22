import { LoadingSpinner } from "@/components/icons";
import { TemplateEditWrapper } from "@/features/template";
import { Suspense } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <>
      <div className="flex-1 bg-background">
        <Suspense fallback={<LoadingSpinner />}>
          <TemplateEditWrapper id={id} />
        </Suspense>
      </div>
    </>
  );
}
