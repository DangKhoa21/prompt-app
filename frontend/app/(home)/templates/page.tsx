"use client";

import PromptTemplateCard from "@/components/prompt/prompt-templates-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { ConfigType } from "@/lib/templates/enum";
import { generateUUID } from "@/lib/utils";
import {
  createPromptTemplate,
  getPromptTemplates,
  getTagsForTemplate,
} from "@/services/prompt";
import {
  ConfigsCreation,
  ConfigsValueCreation,
  PromptWithConfigsCreation,
} from "@/services/prompt/interface";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const useCreatePromptTemplate = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: createPromptTemplate,
    onSuccess: (newTemplateId: string) => {
      router.push(`/templates/${newTemplateId}`);
    },
    onError: (error: string) => {
      console.error("Error creating template:", error);
    },
  });
};

// TODO: Implement UI for templates page (modify for more easy eye viewing)
export default function Page() {
  // const { open } = useSidebar();
  const { isAuthenticated } = useAuth();

  const {
    isPending: isPromptTemplatesLoading,
    isError: isPromptTemplatesError,
    data: promptTemplatesData,
    error: promptTemplatesError,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: () => getPromptTemplates(),
    enabled: isAuthenticated,
  });

  console.log(
    isPromptTemplatesLoading,
    isPromptTemplatesError,
    promptTemplatesData,
    promptTemplatesError,
  );

  const tagsQueries = useQueries({
    queries: (promptTemplatesData || []).map((template) => ({
      queryKey: ["tags", template.id],
      queryFn: () => getTagsForTemplate(template.id),
      enabled: !!template.id,
    })),
  });

  const templatesWithTags = promptTemplatesData?.map((template, index) => ({
    ...template,
    tags: tagsQueries[index]?.data || [],
  }));

  console.log(templatesWithTags);

  const {
    mutate: addTemplate,
    isPending: isCreateTemplatePending,
    isError: isCreateTemplateError,
    error: createTemplateError,
  } = useCreatePromptTemplate();

  // useEffect(() => {
  //   if (isPromptTemplatesError) {
  //     toast.error(
  //       `Failed to load templates for chat (${promptTemplatesError?.message})`,
  //     );
  //   } else if (!isPromptTemplatesLoading &&  promptTemplatesData) {
  //     promptTemplatesData.map((template) => {
  //
  //     })
  //   }
  // }, [isPromptTemplatesError, promptTemplatesError, isPromptTemplatesLoading, promptTemplatesData])

  if (!isAuthenticated) {
    return "You are not login yet, please login manage your templates";
  }

  const handleNewTemplate = () => {
    const values: ConfigsValueCreation[] = [
      {
        id: generateUUID(),
        value: "Teacher",
      },
      {
        id: generateUUID(),
        value: "Assistant",
      },
    ];

    const configs: ConfigsCreation[] = [
      {
        id: generateUUID(),
        label: "Role",
        type: ConfigType.Dropdown.toString(),
        values: values,
      },
      {
        id: generateUUID(),
        label: "Detail",
        type: ConfigType.Textarea.toString(),
        values: [],
      },
    ];

    const template: PromptWithConfigsCreation = {
      id: generateUUID(),
      title: "Template Name",
      description:
        "This template is used for writing, brainstorming new idea for your project, ... etc",
      stringTemplate:
        "You are my ${Role}, and your task is to help me in ${Field} at the level of ${Level}. More detail: ${Detail}",
      configs: configs,
    };

    addTemplate(template);
    console.log(
      isCreateTemplatePending,
      isCreateTemplateError,
      createTemplateError,
    );

    const tags = ["Writing", "Project", "Creative"];
    console.log(tags);
  };

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
              <Button size="sm" onClick={handleNewTemplate}>
                Add new
              </Button>
            </div>

            <Separator
              orientation="horizontal"
              className="w-auto md:mx-4 my-4 bg-neutral-800"
            />

            {!isPromptTemplatesLoading ? (
              promptTemplatesData === undefined ||
              promptTemplatesData?.length === 0 ? (
                "You haven't created any prompt yet, please create new one"
              ) : (
                <div className="md:p-4 grid grid-cols-[repeat(auto-fit,_280px)] gap-4 justify-items-center justify-evenly">
                  {promptTemplatesData.map((template, index) => (
                    <PromptTemplateCard key={index} {...template} tags={[]} />
                  ))}
                </div>
              )
            ) : (
              "Loading"
            )}
          </div>
        </main>
      </div>
    </>
  );
}
