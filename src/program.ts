import {TextLoader} from "langchain/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {Document} from "@langchain/core/documents";
import * as fs from "fs";
import {HotelSourceDocument} from "./types";
import {Pinecone, ServerlessSpecCloudEnum} from '@pinecone-database/pinecone';
import {PineconeStore} from "@langchain/pinecone";
import {OpenAIEmbeddings} from "@langchain/openai";


const __SOURCE_DIR__ = './__SOURCES__'


export const DocumentService = {
    fromTxt: async(): Promise<Document[]> => {
        const loader = new TextLoader(`${__SOURCE_DIR__}/sources.txt`)

        const splitter = new RecursiveCharacterTextSplitter({
            separators: [`###\r\n`],
            chunkSize: 1000,
        });

        const docs = await loader.load();
        const splittedDocs = await splitter.splitDocuments(docs)

        console.log(splittedDocs)

        return splittedDocs;
    },
    fromJson: async(): Promise<Document[]> => {
        const fileContent = fs.readFileSync(`${__SOURCE_DIR__}/sources.json`, {encoding: 'utf-8'});

        const sourceData: HotelSourceDocument[] = JSON.parse(fileContent);

        const docs: Document[] = sourceData.map((sourceDoc) => ({
            metadata: sourceDoc.metadata,
            pageContent: `[${sourceDoc.segment}][${sourceDoc.subsegment}] - ${JSON.stringify(sourceDoc.data)}`
        }));

        console.log(docs)

        return docs;
    }
}

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
