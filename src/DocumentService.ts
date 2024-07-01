import {Document} from "@langchain/core/documents";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import fs from "fs";
import {HotelSourceDocument} from "./types";

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