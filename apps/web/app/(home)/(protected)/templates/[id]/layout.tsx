import { TemplateProvider } from "@/context/template-context";
import { TemplatesIdHeader } from "@/features/template";
import axiosInstance from "@/lib/axios/axiosIntance";
import { TemplateWithConfigs } from "@/services/prompt/interface";

async function getPromptTemplate(id: string): Promise<TemplateWithConfigs> {
  const response = await axiosInstance.get(`/prompts/${id}`);
  return response.data.data;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const template = await getPromptTemplate(params.id);
    if (!template) {
      return {
        title: "Template not found",
        description: "The requested template does not exist.",
      };
    }

    return {
      title: `${template.title}`,
      description: `${template.description}`,
    };
  } catch {
    return {
      title: "Error",
      description: "An error occurred while fetching the template.",
    };
  }
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
