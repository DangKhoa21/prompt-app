import { LoadingSpinner } from "@/components/icons";
import { TemplatesIdHeader } from "@/components/templates/templ-id-header";
import { TemplateEditWrapper } from "@/features/template";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex-1 bg-background">
      <TemplatesIdHeader id={id} />

      <div className="p-4">
        <Suspense fallback={<LoadingSpinner />}>
          <TemplateEditWrapper id={id} />
        </Suspense>
      </div>
    </div>
  );
}
