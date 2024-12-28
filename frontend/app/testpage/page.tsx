"use client";

import { TestMessage } from "@/components/message";
import { useState } from "react";

const processString = (input: string) => {
  // Replace common escape sequences
  const unescaped = input
    .replace(/\\n/g, "\n") // Replace \n with actual newlines
    .replace(/\\r/g, "\r") // Replace \r with carriage returns
    .replace(/\\t/g, "\t") // Replace \t with tabs
    .replace(/\\"/g, '"') // Replace escaped quotes \" with "
    .replace(/\\\\/g, "\\"); // Replace escaped backslashes \\ with \

  return unescaped.trim(); // Remove extra spaces or newlines at the ends
};

const extractMessage = (input: string) => {
  // Check if the string starts with "0:"
  if (input.startsWith("0:")) {
    // Remove the prefix "0:"
    const trimmedInput = input.substring(2).trim();

    // Find the content between the first and last quotes
    const match = trimmedInput.match(/^"([\s\S]*?)"$/);

    // If a match is found, return the extracted content
    return match ? match[1] : "";
  }

  // Return empty string or handle other cases if needed
  return "";
};

export default function Page() {
  // const [message, setMessage] = useState("");
  const [myMessage, setMyMessage] = useState({
    id: "123",
    role: "assistant",
    content: ``,
  });

  const handleClick = async () => {
    let baseString = "";
    const response = await fetch("testpage/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "Write me a complete solution for the hanoi tower python",
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader!.read();
      done = readerDone;

      if (value) {
        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });

        // Process chunks based on their prefix
        if (chunk.startsWith("0:")) {
          // Extract the message inside quotes
          const sub_message = extractMessage(chunk);
          baseString += sub_message;

          // setMessage((prev) => processString(prev + sub_message));
          setMyMessage((prev) => ({
            ...prev,
            content: processString(prev.content + sub_message),
          }));
        } else {
          // Handle other types of messages (e.g., starting with 'e:' or 'd:')
          // console.log("Non-message chunk:", chunk);
          // Optionally parse and log the metadata
          // try {
          //   const jsonData = JSON.parse(chunk.substring(2)); // Remove prefix (e.g., 'e:' or 'd:')
          //   console.log("Parsed metadata:", jsonData);
          // } catch (error) {
          //   console.error("Failed to parse metadata:", chunk, error);
          // }
        }
      }
    }

    // console.log(message);
    console.log(baseString);

    // const reader = response.body
    //   ?.pipeThrough(new TextDecoderStream())
    //   .getReader();
    // while (true) {
    //   const { value, done } = await reader?.read();
    //   if (done) break;
    //   console.log("Received: ", value);
    //   setValue((prev) => prev + value);
    // }
  };

  return (
    <main>
      <p>Streaming response: </p>
      <br />
      {/* <div>{message}</div> */}
      <TestMessage message={myMessage} />
      <button onClick={handleClick}>Submit</button>
    </main>
  );
}
