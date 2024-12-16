import {
  type Message,
  StreamData,
  convertToCoreMessages,
  // streamObject,
  streamText,
} from "ai";

import { customModel } from "@/lib/ai";
import { models } from "@/lib/ai/models";

import {
  // generateUUID,
  getMostRecentUserMessage,
  // sanitizeResponseMessages,
} from "@/lib/utils";

export async function POST(request: Request) {
  const {
    // id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response("Model not found", { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const streamingData = new StreamData();

  const result = await streamText({
    model: customModel(model.apiIdentifier),
    system: "",
    messages: coreMessages,
    maxSteps: 5,
    onFinish: () => {
      streamingData.close();
    },
    // onFinish: async ({ responseMessages }) => {
    //   if (session.user?.id) {
    //     try {
    //       const responseMessagesWithoutIncompleteToolCalls =
    //         sanitizeResponseMessages(responseMessages);

    //       await saveMessages({
    //         messages: responseMessagesWithoutIncompleteToolCalls.map(
    //           (message) => {
    //             const messageId = generateUUID();

    //             if (message.role === "assistant") {
    //               streamingData.appendMessageAnnotation({
    //                 messageIdFromServer: messageId,
    //               });
    //             }

    //             return {
    //               id: messageId,
    //               chatId: id,
    //               role: message.role,
    //               content: message.content,
    //               createdAt: new Date(),
    //             };
    //           }
    //         ),
    //       });
    //     } catch (error) {
    //       console.error("Failed to save chat");
    //     }
    //   }

    //   streamingData.close();
    // },
    // experimental_telemetry: {
    //   isEnabled: true,
    //   functionId: "stream-text",
    // },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}
