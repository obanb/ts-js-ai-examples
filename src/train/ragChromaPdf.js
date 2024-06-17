"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const text_splitter_1 = require("langchain/text_splitter");
const pdf_1 = require("langchain/document_loaders/fs/pdf");
const chroma_1 = require("@langchain/community/vectorstores/chroma");
const model = new openai_1.ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
});
const question = "What themes does Gone with the Wind explore?";
async function main() {
    // create the loader:
    const loader = new pdf_1.PDFLoader('books.pdf', {
        splitPages: false
    });
    const docs = await loader.load();
    // split the docs:
    const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        separators: [`. \n`]
    });
    const splittedDocs = await splitter.splitDocuments(docs);
    // store the data
    const vectorStore = await chroma_1.Chroma.fromDocuments(splittedDocs, new openai_1.OpenAIEmbeddings(), {
        collectionName: 'books',
        url: 'http://localhost:8000'
    });
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
