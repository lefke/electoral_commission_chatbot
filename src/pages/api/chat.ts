import { type NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { CallbackManager } from "langchain/callbacks";

import { supabaseClient } from "@/utils/supabase";
import { ConversationLog } from "@/utils/conversationLog";
import { templates } from "@/utils/templates";
import { getMatchesFromEmbeddings } from "@/utils/matches";
import initPinecone from "@/utils/pinecone-client";
import { Metadata } from '@/types/chat';

export const runtime = "edge";

const bodySchema = z.object({
  question: z.string({
    required_error: "Please ask a question",
  }),
  userId: z.string().optional(),
});

type BodyInput = z.infer<typeof bodySchema>;

export default async function handler(request: NextRequest) {
  if (request.method === "POST") {
    const body = (await request.json()) as BodyInput;

    let parseData;

    try {
      parseData = bodySchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorInput = error.issues.map((e) => ({
          path: e.path[0],
          message: e.message,
        }));

        return NextResponse.json({ errorInput }, { status: 400 });
      }
    }

    const { question, userId } = parseData as BodyInput;

    const supabase = await supabaseClient(process.env.SUPABASE_KEY);
    const conversationLog = new ConversationLog(supabase);

    let conversationHistory: void | String | string[];

    // Right after fetching the conversation history
    try {
      conversationHistory = await conversationLog.getConversation({
        limit: 10,
        userId: userId,
      });
      console.log("Fetched conversation history:", conversationHistory);
    } catch (error: any) {
      return NextResponse.json({ error: error.message });
    }

    try {
      await conversationLog.addEntry({
        entry: question,
        speaker: "user",
        userId: userId || "",
      });
    } catch (error: any) {
      return NextResponse.json({ error: error.message });
    }

    if (typeof conversationHistory === 'string' || typeof conversationHistory === 'undefined') {
      conversationHistory = [question]; // Initialize with the current question if not already an array
    } else if (Array.isArray(conversationHistory)) {
      conversationHistory.push(question); // Append the user's question
    }
    console.log("Updated conversation history with user question:", conversationHistory);

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const callbackManager = CallbackManager.fromHandlers({
      async handleLLMNewToken(token: string) {
        await writer.ready;
        await writer.write(encoder.encode(`data: ${token}\n\n`));
      },
      async handleLLMEnd(result) {
        await writer.ready;
        const metadataArray = matches.map(match => {
          const { text, url } = match.metadata as Metadata; // Extract text and URL
          return { text, url };
        });
  
        // Directly write the JSON string representation of metadataArray
        writer.write(encoder.encode(`event: metadata\ndata: ${JSON.stringify(metadataArray)}\n\n`));
  
        writer.write(encoder.encode(`data: DONE\n\n`)); // Indicate the end of the stream
        console.log(metadataArray);
        writer.close();

        const textResponse = result.generations[0].map((res) => res.text);

        if (Array.isArray(conversationHistory)) {
          conversationHistory.push(textResponse[0]); // Append the AI's response
        } else {
          conversationHistory = [textResponse[0]]; // Fallback to re-initialization if necessary
        }
        console.log("Updated conversation history with AI response:", conversationHistory);
    
        try {
          await conversationLog.addEntry({
            entry: textResponse[0],
            speaker: "ai",
            userId: userId || "",
          });
        } catch (error: any) {
          return NextResponse.json({ error: error.message });
        }
      },
      handleLLMError: async (e) => {
        await writer.ready;
        await writer.abort(e);
      },
    });

    const inquiryChain = new LLMChain({
      llm: new ChatOpenAI({ modelName: "gpt-4-turbo" }),
      prompt: new PromptTemplate({
        template: templates.inquiryTemplate,
        inputVariables: ["userPrompt", "conversationHistory"],
      }),
      verbose: true,
    });

    const inquiryChainResult = await inquiryChain.call({
      userPrompt: question,
      conversationHistory: conversationHistory,
    });

    const inquiry = inquiryChainResult.text;

    const embedder = new OpenAIEmbeddings({
      model: "text-embedding-3-small"
    });

    const embeddings = await embedder.embedQuery(inquiry);
    // console.log("embeddings", embeddings);

    const pinecone = await initPinecone();
    
    const matches = await getMatchesFromEmbeddings(embeddings, pinecone, 3);
    
    const docs = matches && Array.from(
      matches.reduce((map, match) => {
        const metadata = match.metadata as Metadata;
        const { text, url } = metadata;  // Use url and text from the metadata
        if (url && !map.has(url)) {
          map.set(url, text);
        }
        return map;
      }, new Map<string, string>()),
    ).map(([_, text]) => text);

    const chat = new ChatOpenAI({
      streaming: true,
      verbose: true,
      modelName: "gpt-4-turbo",
      callbackManager,
    });

    const chain = new LLMChain({
      prompt: new PromptTemplate({
        template: templates.qaTemplate,
        inputVariables: ["summaries", "question", "conversationHistory"],
      }),
      llm: chat,
      verbose: true,
    });

    // Continue with your existing logic to use `docs` for the conversation
    const allDocs = docs?.join("\n") || "";

    console.log("Final conversation history before LLM chain call:", conversationHistory);

    // Your existing logic to call the chain with allDocs
    chain.call({
      summaries: allDocs, // Changed from summary to allDocs
      question: inquiry,
      conversationHistory,
    }).catch((e) => console.error(e));

    // console.log(chain)

      return new NextResponse(stream.readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
  } else {
    // Optionally handle other methods or return a 405 Method Not Allowed error
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
}
