"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const model = new openai_1.ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
});
async function fromTemplate() {
    const prompt = prompts_1.ChatPromptTemplate.fromTemplate('Write a short description for the following product: {product_name}');
    const wholePrompt = await prompt.format({
        product_name: 'bicycle'
    });
    // creating a chain: connecting the model with the prompt
    const chain = prompt.pipe(model);
    const response = await chain.invoke({
        product_name: 'bicycle'
    });
    console.log(response.content);
}
async function fromMessage() {
    const prompt = prompts_1.ChatPromptTemplate.fromMessages([
        ['system', 'Write a short description for the product provided by the user'],
        ['human', '{product_name}']
    ]);
    const chain = prompt.pipe(model);
    const result = await chain.invoke({
        product_name: 'bicycle'
    });
    console.log(result.content);
}
fromMessage();
