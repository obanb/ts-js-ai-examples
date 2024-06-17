// import { ChromaClient as chromaClient, OpenAIEmbeddingFunction as openAIEmbeddingFunction} from "chromadb";
//
// //http://localhost:8000/docs
//
// import {ChromaClient, OpenAIEmbeddingFunction} from "chromadb/dist/chromadb";
//
// const client = new chromaClient({
//     path: 'http://localhost:8000',
// }) as any as ChromaClient
//
// const embeddingFunction = new openAIEmbeddingFunction({
//     openai_api_key: process.env.OPENAI_API_KEY!,
//     openai_model: 'text-embedding-3-small',
// }) as any as OpenAIEmbeddingFunction
//
// export const main = async() => {
//     const res = await client.createCollection({
//         name: 'data-test-2',
//     })
//
//     console.log(res)
// }
//
// export const addData = async() => {
//    const coll = await client.getCollection({name: 'data-test-1', embeddingFunction: embeddingFunction})
//
//     const res = await coll.add({
//         ids: ['id0'],
//         documents: ['entry'],
//     })
//
//     console.log(res)
// }
//
//
// addData()