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

    const reply = response.output_text;

    return NextResponse.json({
      reply: reply
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { reply: "Error contacting AI" },
      { status: 500 }
    );
  }
}