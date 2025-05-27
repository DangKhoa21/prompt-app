import { SERVER_URL, VERSION_PREFIX } from "@/config";
import { TemplateProvider } from "@/context/template-context";
import { TemplatesIdHeader } from "@/features/template";
import { TemplateWithConfigs } from "@/services/prompt/interface";
import axios from "axios";

async function getPromptTemplate(id: string): Promise<TemplateWithConfigs> {
  const response = await axios.get(
    `${SERVER_URL}/${VERSION_PREFIX}/prompts/${id}`,
  );
  return response.data.data;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const template = await getPromptTemplate(params.id);

  return {
    title: `Template: ${template.title}`,
    description: `Template for ${template.description}`,
  };
}

export default function TemplateIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { id } = params;
  return (
    <TemplateProvider>
      <TemplatesIdHeader id={id} />
      {children}
    </TemplateProvider>
  );
}
