import { config } from "@/app/utils/config";
import { fetchTransactionsFromFile } from "@/app/utils/fetchTransactionsFromFile";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    const jsonBody = fetchTransactionsFromFile();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: JSON.stringify(config, null, 2),
          },
          {
            role: "user",
            content: `Review these latest blockchain mints:\n${JSON.stringify(
              jsonBody,
              null,
              2
            )}\n\nWhat do you think? !IMPORTANT simply respond with no more than 1 lines please. Keep it short non generic and informative.`,
          },
        ],
        store: true,
      }),
    });

    const data = await response.json();
    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      { status: 200 }
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500 }
    );
  }
}
