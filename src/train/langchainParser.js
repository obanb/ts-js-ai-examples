"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
const output_parsers_2 = require("langchain/output_parsers");
const model = new openai_1.ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
});
//get only content as raw string
async function stringParser() {
    const prompt = prompts_1.ChatPromptTemplate.fromTemplate('Write a short description for the following product: {product_name}');
    const parser = new output_parsers_1.StringOutputParser();
    // creating a chain: connecting the model with the prompt
    const chain = prompt.pipe(model).pipe(parser);
    const response = await chain.invoke({
        product_name: 'bicycle'
    });
    console.log(response);
}
// ['bread', 'flour', 'water', 'salt', 'yeast']
async function commaSeparatedParser() {
    const prompt = prompts_1.ChatPromptTemplate.fromTemplate('Provide the first 5 ingredients, separated by commas, for: {word}');
    const parser = new output_parsers_1.CommaSeparatedListOutputParser();
    // creating a chain: connecting the model with the prompt
    const chain = prompt.pipe(model).pipe(parser);
    const response = await chain.invoke({
        word: 'bread'
    });
    console.log(response);
}
// {name: 'John', likes: 'Pineapple pizza'}
async function structuredParser() {
    const templatePrompt = prompts_1.ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase. 
    Formatting instructions: {format_instructions}
    Phrase: {phrase}
    `);
    const outputParser = output_parsers_2.StructuredOutputParser.fromNamesAndDescriptions({
        name: 'the name of the person',
        likes: 'what the person likes'
    });
    const chain = templatePrompt.pipe(model).pipe(outputParser);
    const result = await chain.invoke({
        phrase: 'John is likes Pineapple pizza',
        format_instructions: outputParser.getFormatInstructions()
    });
    console.log(result);
}
structuredParser();
