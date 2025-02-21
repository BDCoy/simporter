import Anthropic from "@anthropic-ai/sdk";
import { validateConfig } from "./config";
import { supabase } from "./supabase";
import { ensureAuthenticated } from "./auth";

interface AIResponse {
  content: string;
  tokens_used: number;
}

export async function* streamAIResponse(
  prompt: string,
  systemPrompt?: string | null
): AsyncGenerator<string, AIResponse> {
  try {
    if (!prompt.trim()) {
      throw new Error("Please enter a message to continue");
    }

    const config = validateConfig();
    if (!config.apiKey) {
      throw new Error(
        "API key is missing. Please check your environment variables."
      );
    }

    const user = await ensureAuthenticated();
    if (!user) {
      throw new Error("Authentication failed");
    }

    const anthropic = new Anthropic({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true,
    });

    // Construct the structured prompt
    const structuredPrompt = `
    Act as an advanced AI assistant specialized in generating technical reports and presentations.
    The user has requested information on: "${prompt}".
    Your response should include:

    1. **Executive Summary**: Clear and concise summary with key insights.
    2. **Data Analysis**: If relevant, include well-formatted tables and charts in Markdown.
    3. **Source Code (if requested)**: Relevant scripts for computations or data visualization.
    4. **Q&A Section**: Provide potential questions and answers relevant to stakeholders.
    5. **Slide Generation (JSON for Slidev)**: Convert report highlights into structured JSON compatible with [Slidev](https://sli.dev).

    **Format your response in the following JSON structure:**
    {
      "content": "Full detailed report",
      "deliverables": {
        "code": {
          "language": "code language",
          "content": "Relevant scripts (if any)",
        },
        "data": "Tables/Graphs",
        "slides": {
          "title": "Presentation Title",
          "slides": [
           {
              "id": "string", // A unique identifier for the slide to maintain order and reference
              "title": "string", // The main heading of the slide, summarizing its content
              "content": "string", // A short explanation of the slide topic, giving an overview of its subject
              "notes": "string", // Speaker notes providing additional context, guidance, or key talking points for presenters
              "layout": "string", // Defines the type of slide layout. Possible values: 'title', 'content', 'twoColumn', 'comparison', 'chart'
              "elements": [
                {
                  "type": "string", // Defines the type of content element in the slide: 'text', 'image', 'chart', or 'table'
                  "content": {
                    "if type = 'text'": "string", // The actual text displayed in the slide
                    "if type = 'image'": "string", // Filename or URL of the image
                    "if type = 'chart'": {
                      "type": "string", // Type of chart (e.g., 'bar', 'line', 'pie')
                      "labels": ["string"], // Labels for the X-axis or categories
                      "values": [number] // Data points corresponding to labels
                    },
                    "if type = 'table'": [
                      ["string", "string"], // Column headers
                      ["string", "string"], // Row 1 data
                      ["string", "string"]  // Row 2 data (and so on)
                    ]
                  }
                }
              ]
            }
          ] (include at least 5 slides)
        },
        "executive_summary": "Concise business-friendly summary.",
        "q_and_a": [
          { "question": "Potential question?", "answer": "Detailed answer." }
        ]
      }
    }`;

    const stream = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      temperature: 0.7,
      system: structuredPrompt,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    let fullContent = "";
    for await (const chunk of stream) {
      if (chunk?.delta?.text) {
        const text = chunk.delta.text;
        fullContent += text;
        yield text;
      }
    }

    try {
      const { error: insertError } = await supabase.from("messages").insert({
        content: fullContent,
        type: "assistant",
        tokens_used: Math.ceil(fullContent.length / 4),
        user_id: user.id,
      });
      if (insertError) {
        console.error("Failed to store message:", insertError);
      }
    } catch (error) {
      console.error("Failed to store message:", error);
    }

    return {
      content: fullContent,
      tokens_used: Math.ceil(fullContent.length / 4),
    };
  } catch (error) {
    console.error("AI API Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}