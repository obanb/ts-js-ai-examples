import OpenAI from "openai";
import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai";
import {Pinecone} from "@pinecone-database/pinecone";
import fs from "fs";
import {HotelSourceDocument} from "./types";
import {Document} from "@langchain/core/documents";
import {PineconeStore} from "@langchain/pinecone";

const __SOURCE_DIR__ = './__SOURCES__'
const __PINECONE_IDX__ = 'rag-chat-01'

export const ragChat = async() => {
    const openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!
    });
    const model = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7,
    })
    // instance level context for demonstration
    const __CTX__: OpenAI.Chat.Completions.ChatCompletionMessageParam[]  = []

    const pineconeClient = new Pinecone({
        apiKey: process.env.PINECONE_KEY!,
    });

    const indexes = await pineconeClient!.listIndexes();
    const existingIndex = indexes.indexes?.map((index) => index.name).includes(__PINECONE_IDX__);
    if(!existingIndex) {
        console.log(`Creating Pinecone Index ${__PINECONE_IDX__}..`)
        await pineconeClient!.createIndex({
            name: __PINECONE_IDX__,
            // 1536 is the default dimension for OpenAI embeddings which im using
            dimension: 1536,
            //  cosine because context and relative importance of features are more critical than their absolute values
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud:  'aws',
                    region: 'us-east-1'
                }
            }
        })

        const fileContent = fs.readFileSync(`${__SOURCE_DIR__}/sources.json`, {encoding: 'utf-8'});

        const sourceData: HotelSourceDocument[] = JSON.parse(fileContent);

        const docs: Document[] = sourceData.map((sourceDoc) => ({
            metadata: sourceDoc.metadata,
            pageContent: `[${sourceDoc.segment}][${sourceDoc.subsegment}] - ${JSON.stringify(sourceDoc.data)}`
        }));

        const pineconeIndex = pineconeClient.Index(__PINECONE_IDX__);

        await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
            pineconeIndex,
            maxConcurrency: 5,
        });
    }

    const pineconeIndex = pineconeClient.Index(__PINECONE_IDX__);

    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings(),
        { pineconeIndex }
    );


    return {
        chat: async (prompt: string) => {
            // 1. create OpenAI embedding for query against vector database - if needed - we dont need do this because of langchain vector store
            // const res = await openaiClient!.embeddings.create({
            //     model: 'text-embedding-3-small',
            //     input: prompt
            // });
            // const embedding = res.data[0].embedding;

            const results = await vectorStore.similaritySearch(prompt, 1);

            console.log(JSON.stringify(results, null, 2))
        }
    }
}