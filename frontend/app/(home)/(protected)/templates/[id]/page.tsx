import { TemplatesIdHeader, TemplateEditWrapper } from "@/features/template";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <>
      <TemplatesIdHeader id={id} />

      <TemplateEditWrapper id={id} />
    </>
  );
}
