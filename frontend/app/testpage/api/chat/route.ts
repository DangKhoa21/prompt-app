export async function POST(req: Request) {
  const body = await req.json();
  const response = await fetch("http://localhost:3001/gemini/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // console.log(res);

  // Set up the response headers for streaming
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Create a new readable stream to pipe the data back to the client
  const readableStream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        controller.enqueue(value);
      }

      controller.close();
    },
  });

  return new Response(readableStream, {
    status: response.status,
    headers,
  });
}
