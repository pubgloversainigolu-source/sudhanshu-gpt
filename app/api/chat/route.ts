import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: message
    });

    return NextResponse.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { reply: "Error contacting AI" },
      { status: 500 }
    );
  }
}