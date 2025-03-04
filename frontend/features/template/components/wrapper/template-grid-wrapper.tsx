import { LoadingSpinner } from "@/components/icons";
import PromptTemplateCard from "@/components/prompt/prompt-templates-card";
import { getPromptTemplates, getTagsForTemplate } from "@/services/prompt";
import { TemplateTag } from "@/services/prompt/interface";
import { useQueries, useQuery } from "@tanstack/react-query";

export function TemplateGridWrapper() {
  const {
    isPending: isPromptTemplatesLoading,
    isError: isPromptTemplatesError,
    data: promptTemplatesData,
    error: promptTemplatesError,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: () => getPromptTemplates(),
  });

  const tagsQueries = useQueries({
    queries: (promptTemplatesData || []).map((template) => ({
      queryKey: ["tags", template.id],
      queryFn: () => getTagsForTemplate(template.id),
      enabled: !!template.id,
    })),
  });

  if (isPromptTemplatesLoading) {
    return (
      <>
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (isPromptTemplatesError) {
    console.error("Error loading prompt templates: " + promptTemplatesError);
    return (
      <>
        <div className="flex justify-center items-center">
          <p>Error in loading prompt templates. Please try again!</p>
        </div>
      </>
    );
  }

  return (
    <>
      {promptTemplatesData === undefined ||
      promptTemplatesData?.length === 0 ? (
        <div className="flex justify-center items-center">
          You haven&apos;t created any prompt yet, please create new one
        </div>
      ) : (
        <div className="md:p-4 grid grid-cols-[repeat(auto-fit,_280px)] gap-4 justify-items-center justify-evenly">
          {promptTemplatesData.map((template, index) => (
            <PromptTemplateCard
              key={index}
              {...template}
              tags={(tagsQueries[index]?.data || []).map(
                ({ id, name }): TemplateTag => ({
                  id,
                  name,
                }),
              )}
            />
          ))}
        </div>
      )}
    </>
  );
}
