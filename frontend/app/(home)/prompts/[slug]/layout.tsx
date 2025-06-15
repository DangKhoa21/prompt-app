import { DetailsHeader } from "@/components/details/details-header";
import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { getIdFromDetailURL } from "@/lib/utils";
import { Prompt } from "@/services/prompt/interface";
import axios from "axios";

async function getPrompt(id: string | null): Promise<Prompt> {
  const response = await axios.get(
    `${SERVER_URL}/${VERSION_PREFIX}/prompts/${id}`,
  );
  return response.data.data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const promptId = getIdFromDetailURL(slug);

  const prompt = await getPrompt(promptId);

  return {
    title: `Prompt: ${prompt.title}`,
    description: `Prompt Detail: ${prompt.description}`,
  };
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
