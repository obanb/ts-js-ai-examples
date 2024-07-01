// import {OpenAI} from "openai";
// import fs from "fs";
// import {HotelSourceDocument} from "../types";
// import {Document} from "@langchain/core/documents";
//
// // module level context for demonstration
// const __CTX__: OpenAI.Chat.Completions.ChatCompletionMessageParam[]  = []
//
//
// const ragChat = () => {
//     const openai = new OpenAI({
//         apiKey: process.env.OPENAI_API_KEY!
//     });
//     // instance level context for demonstration
//     const __CTX__: OpenAI.Chat.Completions.ChatCompletionMessageParam[]  = []
//
//     const fileContent = fs.readFileSync(`${__SOURCE_DIR__}/sources.json`, {encoding: 'utf-8'});
//
//     const sourceData: HotelSourceDocument[] = JSON.parse(fileContent);
//
//     const docs: Document[] = sourceData.map((sourceDoc) => ({
//         metadata: sourceDoc.metadata,
//         pageContent: `[${sourceDoc.segment}][${sourceDoc.subsegment}] - ${JSON.stringify(sourceDoc.data)}`
//     }));
//
//     return {
//         chat: async (prompt: string) => {
//             //1. create an OpenAI embedding for the prompt
//             const questionEmbeddingResult = await openai.embeddings.create({
//                 model: 'text-embedding-3-small',
//                 input: prompt
//             });
//             const questionEmbedding = questionEmbeddingResult.data[0].embedding;
//
//
//         }
//     }
// }