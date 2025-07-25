import { DetailsHeader } from "@/components/details/details-header";
import axiosInstance from "@/lib/axios/axiosIntance";
import { getIdFromDetailURL } from "@/lib/utils";
import { Prompt } from "@/services/prompt/interface";

async function getPrompt(id: string | null): Promise<Prompt> {
  const response = await axiosInstance.get(`/prompts/${id}`);
  return response.data.data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const promptId = getIdFromDetailURL(slug);

  try {
    const prompt = await getPrompt(promptId);
    if (!prompt) {
      return {
        title: "Prompt not found",
        description: "The requested prompt does not exist.",
      };
    }
    return {
      title: prompt.title,
      description: `${prompt.description}`,
    };
  } catch {
    return {
      title: "Error",
      description: "An error occurred while fetching the prompt.",
    };
  }
}

export default function PromptDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DetailsHeader pageName="Prompt Detail"></DetailsHeader>
      <div className="min-h-screen">
        <div className="p-2 md:p-8 bg-muted">{children}</div>
      </div>
    </>
  );
}
