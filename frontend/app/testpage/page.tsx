"use client";

import { PreviewMessage } from "@/components/message";
import { useChat } from "ai/react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "http://localhost:3001/gemini/stream",
  });

  return (
    <>
      {messages.map((m) => (
        <PreviewMessage key={m.id} message={m} />
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="border border-black"
          type="text"
          value={input}
          onChange={handleInputChange}
        />
      </form>
    </>
  );
}
