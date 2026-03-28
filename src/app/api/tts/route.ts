import { ElevenLabsClient } from "elevenlabs";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const VOICE_ID = "6lbtrJXRylVZ6EqIQQPT";

export async function POST(request: NextRequest) {
  // Auth check: only authenticated users can use TTS
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 500 }
    );
  }

  let text: string;
  try {
    const body = await request.json();
    text = body?.text;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing required field: text" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const client = new ElevenLabsClient({ apiKey });

    const audioStream = await client.textToSpeech.convert(VOICE_ID, {
      text: text.slice(0, 500), // guard against overly long text
      model_id: "eleven_flash_v2_5",
      output_format: "mp3_44100_128",
    });

    // Collect stream into buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[TTS] ElevenLabs error:", err);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
