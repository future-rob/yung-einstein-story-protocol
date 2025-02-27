import { config } from "@/app/utils/config";
import { fetchTransactionsFromFile } from "@/app/utils/fetchTransactionsFromFile";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    const jsonBody = await req.json(); // Use req.json() instead of parsing body manually
    const { text } = jsonBody;

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
      });
    }

    const transactionData = fetchTransactionsFromFile();

    const content = `## STORY Transaction Data
${transactionData}

## User Message
${text}

## Instructions
Given the STORY Transaction Data answer the User Message accordingly. Include specific relevant data.

## Response
Respond first with the text then underneath add relevant data
"""
"Response"

"Data"
"""
`;

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
          { role: "user", content },
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
