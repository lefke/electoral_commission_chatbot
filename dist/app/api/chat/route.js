import { NextResponse } from "next/server";
import { z } from "zod";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { supabaseClient } from "@/utils/supabase";
import { ConversationLog } from "@/utils/conversationLog";
import { templates } from "@/utils/templates";
import { getMatchesFromEmbeddings } from "@/utils/matches";
import initPinecone from "@/utils/pinecone-client";
export const runtime = "edge";
const bodySchema = z.object({
    question: z.string({
        required_error: "Please ask a question",
    }),
});
export async function POST(request) {
    const body = (await request.json());
    let parseData;
    try {
        parseData = bodySchema.parse(body);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const errorInput = error.issues.map((e) => ({
                path: e.path[0],
                message: e.message,
            }));
            return NextResponse.json({ errorInput }, { status: 400 });
        }
    }
    const { question } = parseData;
    // Assuming you still want to use Supabase for storing conversation logs
    const supabase = await supabaseClient(process.env.SUPABASE_KEY); // Adjust according to your setup
    const conversationLog = new ConversationLog(supabase);
    let conversationHistory;
    try {
        conversationHistory = await conversationLog.getConversation({
            limit: 10,
        });
    }
    catch (error) {
        return NextResponse.json({ error: error.message });
    }
    try {
        await conversationLog.addEntry({
            entry: question,
            speaker: "user"
        });
    }
    catch (error) {
        return NextResponse.json({ error: error.message });
    }
    // Assuming you want to use a custom callback handler for specific actions
    const consoleCallbackHandler = {
        handleLLMNewToken: async (token) => {
            await writer.ready;
            await writer.write(encoder.encode(`data: ${token}\n\n`));
        },
    };
    const inquiryChain = new LLMChain({
        llm: new ChatOpenAI({ modelName: "gpt-3.5-turbo" }),
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
    const pinecone = await initPinecone();
    const matches = await getMatchesFromEmbeddings(embeddings, pinecone, 3);
    const docs = matches && Array.from(matches.reduce((map, match) => {
        const metadata = match.metadata;
        const { pageContent, loc } = metadata;
        if (!map.has(loc)) {
            map.set(loc, pageContent);
        }
        return map;
    }, new Map())).map(([_, text]) => text);
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const chat = new ChatOpenAI({
        streaming: true,
        verbose: true,
        modelName: "gpt-3.5-turbo",
        callbacks: [consoleCallbackHandler], // Pass the simplified callback handler
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
    if (allDocs.length > 4000) {
        console.log(`Just a second, forming final answer...`);
    }
    // Your existing logic to call the chain with allDocs
    chain.call({
        summaries: allDocs,
        question: inquiry,
        conversationHistory,
    }).catch((e) => console.error(e));
    // The rest of your function...
    return new NextResponse(stream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
        },
    });
}
