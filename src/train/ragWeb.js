"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("@langchain/openai");
const memory_1 = require("langchain/vectorstores/memory");
const prompts_1 = require("@langchain/core/prompts");
const cheerio_1 = require("langchain/document_loaders/web/cheerio");
const text_splitter_1 = require("langchain/text_splitter");
const model = new openai_1.ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
});
const question = "What are langchain libraries?";
async function main() {
    // create the loader:
    const loader = new cheerio_1.CheerioWebBaseLoader('https://js.langchain.com/docs/get_started/introduction');
    const docs = await loader.load();
    // split the docs:
    const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 20
    });
    const splittedDocs = await splitter.splitDocuments(docs);
    // store the data
    const vectorStore = new memory_1.MemoryVectorStore(new openai_1.OpenAIEmbeddings());
    await vectorStore.addDocuments(splittedDocs);
    // create data retriever:
    const retriever = vectorStore.asRetriever({
        k: 2
    });
    // get relevant documents:
    const results = await retriever.getRelevantDocuments(question);
    const resultDocs = results.map(result => result.pageContent);
    //build template:
    const template = prompts_1.ChatPromptTemplate.fromMessages([
        ['system', 'Answer the users question based on the following context: {context}'],
        ['user', '{input}']
    ]);
    const chain = template.pipe(model);
    const response = await chain.invoke({
        input: question,
        context: resultDocs
    });
    console.log(response.content);
}
main();
