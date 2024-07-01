import {Pinecone, ServerlessSpecCloudEnum} from "@pinecone-database/pinecone";
import {Document} from "@langchain/core/documents";
import {PineconeStore} from "@langchain/pinecone";
import {OpenAIEmbeddings} from "@langchain/openai";

export  const PineconeService = (serverlessSpec:{
    cloud: ServerlessSpecCloudEnum,
    region: string
}) => {
    let pineconeClient: Pinecone | null = null;
    return {
        init: () => {
            pineconeClient = new Pinecone({
                apiKey: process.env.PINECONE_KEY!,
            });
        },
        index: {
            // create a pinecone index if it does not exist, configuration corresponds to OpenAI embeddings
            create: async(name: string) => {
                const indexes = await pineconeClient!.listIndexes();

                const existingIndex = indexes.indexes?.map((index) => index.name).includes(name);
                if(existingIndex) {
                    console.log(`Index ${name} already exists`);
                    return
                }
                // pinecone index is not immediately ready to use, await is just for request completion
                await pineconeClient!.createIndex({
                    name,
                    // 1536 is the default dimension for OpenAI embeddings which im using
                    dimension: 1536,
                    //  cosine because context and relative importance of features are more critical than their absolute values
                    metric: 'cosine',
                    spec: {
                        serverless: serverlessSpec
                    }
                })
                console.log(`Index ${name} request completed..`)
            },
            get: (name: string) => {
                return pineconeClient!.index(name)
            },
            describe: async(name: string) => {
                const index = await pineconeClient!.describeIndex(name)
                return index.status.ready
            },
            delete: async(name: string) => {
                await pineconeClient!.deleteIndex(name)
                console.log(`Index ${name} deleted..`)
            }
        },
        store: {
            fromDocuments: async(indexName: string, docs: Document[]) => {
                const index = pineconeClient!.index(indexName)

                const store = await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
                    pineconeIndex: index,
                    maxConcurrency: 5,
                });

                console.log(`Store created for index ${indexName}..`)

                return store;
            },
        }
    }
}
