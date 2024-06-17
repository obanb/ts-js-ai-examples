"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const tiktoken_1 = require("tiktoken");
const openai = new openai_1.OpenAI();
// options
// temperature 0-2 - lower temperature means greater determinism
// max_tokens 1-4096
// top_p 0-1 diversity, for max deterministic use top_p and temperature, 30% top_p means means that only the tokens comprising the top 30% probability mass are considered
// n - number of choices to generate
// frequency_penalty 0-2  greater value decreases the likelihood of the model repeat same line verbatim
// Presence penalty 0-2  greater value more change to new topics/branches
// seed -  seed parameter to any integer of your choice and use the same value across requests, ensure all other parameters (like prompt or temperature) are the exact same across requests.
// response_format - json_object, json_array, plain_text..
// system_fingerprint - response parameter to monitor changes in the backend
async function main() {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
                role: 'system',
                content: `Respond at JSON format like this:
                answer: your answer
            `
            }, {
                role: 'user',
                // OpenAI roles
                // system, user
                // assistant for responses
                content: 'Are you alive?'
            }]
    });
    console.log(response.choices[0].message);
    encodePrompt();
}
function encodePrompt() {
    const prompt = "Are you alive?";
    const encoder = (0, tiktoken_1.encoding_for_model)('gpt-3.5-turbo');
    const words = encoder.encode(prompt);
    console.log(words);
    // return  [ 4438, 527, 499, 3432, 30 ]
    // [tokenId] for each token in the prompt
    // https://platform.openai.com/tokenizer
    // https://huggingface.co/learn/nlp-course/chapter6/5 - byte-pair tokenization
    // https://huggingface.co/learn/nlp-course/chapter6/6?fw=pt word-piece tokenization
    // https://huggingface.co/learn/nlp-course/chapter6/7?fw=pt - unigram tokenization
}
main();
