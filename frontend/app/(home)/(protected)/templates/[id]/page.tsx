import { LoadingSpinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TemplateEditWrapper } from "@/features/template";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/templates">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-sm font-medium">Templates</h1>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <TemplateEditWrapper id={id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
