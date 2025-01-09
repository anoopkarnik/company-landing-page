import { NextResponse } from "next/server";
import OpenAI from "openai";
import { shareRoute } from "../../shareRoute";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });
const assistant_id = process.env.OPENAI_ASSISTANT_ID as string;

let threadId: string | null = null;

export async function POST(request: Request) {
    return shareRoute(request, async (req:Request,body:any) => {
        try {
            const { chatMessage } =  body;

            if (!threadId) {
                const thread = await openai.beta.threads.create();
                threadId = thread.id;
            }

            await openai.beta.threads.messages.create(threadId, {
                role: "user",
                content: chatMessage,
            });

            const run = await openai.beta.threads.runs.createAndPoll(threadId, {
                assistant_id,
                instructions: `
                    - Maintain a polite, conversational tone.
                    - Use clear and concise sentences.
                    - Add line breaks between different points or steps.
                    - Format any lists as:
                    1. Step 1
                    2. Step 2
                    - Use bold text for emphasis and wrap inline code with backticks (\`).
                    - End each response with a brief summary or suggestion if applicable.
                `,
            });

            if (run.status === "completed") {
                const messages: any = await openai.beta.threads.messages.list(run.thread_id);
                return NextResponse.json({
                    reply: messages.data[0].content[0].text.value,
                });
            } else {
                return NextResponse.json({ error: "Failed to generate a response." }, { status: 500 });
            }
        } catch (error) {
            console.error("Error in OpenAI API:", error);
            return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
        }
    });
}
