import {TextLoader} from "langchain/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {Document} from "@langchain/core/documents";
import * as fs from "fs";

export type SourceDocument<T> = {
    data: string;
    segment: string;
    subsegment: string;
    metadata: T;
}

export type HotelSourceDocument = SourceDocument<{
    hotelName: string;
}>


const __SOURCE_DIR__ = './__SOURCES__'

export const documentLoaders = {
    fromTxt: async(): Promise<Document[]> => {
        const loader = new TextLoader(`${__SOURCE_DIR__}/sources.txt`)

        const splitter = new RecursiveCharacterTextSplitter({
            separators: [`###\r\n`],
            chunkSize: 1000,
        });

        const docs = await loader.load();
        const splittedDocs = await splitter.splitDocuments(docs)

        return splittedDocs;
    },
    fromJson: async(): Promise<Document[]> => {
        const fileContent = fs.readFileSync(`${__SOURCE_DIR__}/sources.json`, {encoding: 'utf-8'});

        const sourceData: HotelSourceDocument[] = JSON.parse(fileContent);

        const docs: Document[] = sourceData.map((sourceDoc) => ({
            metadata: sourceDoc.metadata,
            pageContent: `[${sourceDoc.segment}][${sourceDoc.subsegment}] - ${sourceDoc.data}`
        }));

        return docs;
    }
}