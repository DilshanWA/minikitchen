
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseURL =
    process.env.OPENROUTER_API_BASE_URL ??
    "https://openrouter.ai/api/v1";

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "API key is missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${baseURL}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: "Reply with exactly: MiniKitchen AI works!",
            },
          ],
          max_tokens: 30,
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", response.status, data);

      return NextResponse.json(
        {
          ok: false,
          status: response.status,
          error: data.error?.message ?? "API request failed",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      model: data.model,
      reply: data.choices?.[0]?.message?.content,
    });
  } catch (error) {
    console.error("Connection error:", error);

    return NextResponse.json(
      { ok: false, error: "Could not connect to OpenRouter" },
      { status: 502 }
    );
  }
}
