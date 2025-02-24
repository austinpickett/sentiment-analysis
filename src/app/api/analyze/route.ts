import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);
const MAX_LENGTH = 512;

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const truncatedText = text.slice(0, MAX_LENGTH * 4);

    const result = await hf.textClassification({
      model: "nlptown/bert-base-multilingual-uncased-sentiment",
      inputs: truncatedText,
    });

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze sentiment" },
      { status: 500 }
    );
  }
}
