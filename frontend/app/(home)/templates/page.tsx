"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { TemplateGridWrapper } from "@/features/template";
import { AddNewTemplateButton } from "@/features/template/components/AddNewTemplateButton";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return "You are not login yet, please login manage your templates";
  }

  return (
    <>
      <div className="flex h-screen">
        <main className="flex-1 overflow-auto bg-slate-50 p-4">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/marketplace">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-sm font-medium">Templates</h1>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search templates..." className="pl-9" />
            </div>
            <Button variant="outline" className="shrink-0">
              Filters
            </Button>
          </div>

          <div className=" bg-background-primary rounded-lg lg:p-6 lg:m-6">
            <div className="flex items-center justify-between md:mb-4 md:mx-4">
              <h2 className="text-lg font-bold">Your templates</h2>
              <AddNewTemplateButton />
            </div>

            <Separator
              orientation="horizontal"
              className="w-auto md:mx-4 my-4 bg-neutral-800"
            />

            <TemplateGridWrapper />
          </div>
        </main>
      </div>
    </>
  );
}
