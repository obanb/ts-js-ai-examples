import OpenAI from "openai";

export const OpenAIService = () => {
    let openaiClient: OpenAI | null = null;
    return {
        init: () => {
            openaiClient = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY!
            });
        },
        createEmbedding: async (text: string) => {
            const res = await openaiClient!.embeddings.create({
                model: 'text-embedding-3-small',
                input: text
            });
            const embedding = res.data[0].embedding;
            return embedding;
        },
        getMessage: async (prompt: string, retrievalData: string) => {
            const choices = await simpleRagCompletion(openaiClient!, prompt, retrievalData);
            return choices[0].message
        },
        getMessages: async (prompt: string, retrievalData: string) => {
            const choices = await simpleRagCompletion(openaiClient!, prompt, retrievalData);
            return choices.map((choice) => choice.message)
        }

    }
}

const simpleRagCompletion = async (openai: OpenAI, prompt: string, retrievalData: string) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [{
            role: 'assistant',
            content: `Answer the next question using this information: ${retrievalData}` // context injection
        },
            {
                role:'user',
                content: prompt
            }]
    })
    return response.choices
}