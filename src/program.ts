import {TextLoader} from "langchain/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {Document} from "@langchain/core/documents";
import * as fs from "fs";
import {HotelSourceDocument} from "./types";


const __SOURCE_DIR__ = './__SOURCES__'

// Use cosine similarity when the context and relative importance of features are more critical than their absolute values. This is often the case in text-based queries and natural language processing.
// Use dot product when the magnitude of overlap is important, which might be relevant in scenarios where the total number of matching features matters.

// collection group of indexes

export const documentLoaders = {
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