import OpenAI from "openai";

export async function POST(req: Request) {
  const { message } = await req.json();

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const stream = await client.responses.stream({
    model: "gpt-4o-mini",
    input: message
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === "response.output_text.delta") {
          controller.enqueue(encoder.encode(event.delta));
        }
      }
      controller.close();
    }
  });

  return new Response(readable);
}