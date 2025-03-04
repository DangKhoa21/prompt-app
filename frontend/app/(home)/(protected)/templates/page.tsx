import React, { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AddNewTemplateButton, TemplateGridWrapper } from "@/features/template";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

  return (
    <main className="flex-1 bg-background">
      <TemplatesHeader />

      <div className="max-w-6xl mx-auto">
        <TemplatesSearch />

        <Suspense fallback={<LoadingSpinner />}>
          <TagsList />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <TemplateGridWrapper filter={filter} tab={tab} />
        </Suspense>
      </div>
    </main>
  );
}
