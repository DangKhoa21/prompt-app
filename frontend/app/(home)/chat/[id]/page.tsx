import { ChatWrapper } from "@/components/chat/chat-wrapper";
import { loadSavedModelId } from "../action";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const selectedModelId = await loadSavedModelId();

  return <ChatWrapper id={id} selectedModelId={selectedModelId} />;
}
