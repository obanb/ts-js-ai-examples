"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("@langchain/openai");
const memory_1 = require("langchain/vectorstores/memory");
const documents_1 = require("@langchain/core/documents");
const prompts_1 = require("@langchain/core/prompts");
const model = new openai_1.ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
});
const myData = [
    "My name is John.",
    "My name is Bob.",
    "My favorite food is pizza.",
    "My favorite food is pasta.",
];
const question = "What are my favorite foods?";
async function main() {
    // store the data
    const vectorStore = new memory_1.MemoryVectorStore(new openai_1.OpenAIEmbeddings());
    await vectorStore.addDocuments(myData.map(content => new documents_1.Document({ pageContent: content })));
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
