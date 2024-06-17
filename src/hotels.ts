import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai";
import { TextLoader } from 'langchain/document_loaders/fs/text'
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {MemoryVectorStore} from "langchain/vectorstores/memory";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { PineconeStore } from "@langchain/pinecone";


const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
});


export const main = async() => {
    const loader = new TextLoader('src/hotels.txt')

    const splitter = new RecursiveCharacterTextSplitter({
        // separators: [`###\r\n`],
        chunkSize: 1000
    });

    const docs = await loader.load();


    const splittedDocs = await splitter.splitDocuments(docs)

    console.log(splittedDocs)

    const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
    await vectorStore.addDocuments(splittedDocs);

    const retriever = vectorStore.asRetriever({
        k: 1,
        searchType: 'similarity'
    });

    const baseCompressor = LLMChainExtractor.fromLLM(model);

    const compression_retriever = new ContextualCompressionRetriever({
        baseRetriever: retriever,
        baseCompressor
    })

    const res = await compression_retriever.getRelevantDocuments('ma flavors otevreno?')
    const resDocs = res.map(
        result => result.pageContent
    );

    const results = await retriever.getRelevantDocuments('ma restaurace flavors otviraci dobu?');
    const resultDocs = results.map(
        result => result.pageContent
    );

    // console.log(resultDocs)
    console.log(resDocs)

    // const template = ChatPromptTemplate.fromMessages([
    //     ['system', 'Answer the users question based on the following context: {context}'],
    //     ['user', '{input}']
    // ]);
    //
    //
    // const chain = template.pipe(model);

    // const response = await chain.invoke({
    //     input: 'Co muzu delat v okoli hotelu?',
    //     context: resultDocs
    // });
    //
    // console.log(response.content)
}

main()