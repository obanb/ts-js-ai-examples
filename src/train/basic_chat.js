"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const tiktoken_1 = require("tiktoken");
const openai = new openai_1.OpenAI();
const encoder = (0, tiktoken_1.encoding_for_model)('gpt-3.5-turbo');
const MAX_TOKENS = 800;
const ctx = [
    {
        role: 'system',
        content: 'you are helpful chatbot'
    },
];
const createChatCompletion = async () => {
    const resp = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: ctx
    });
    const msg = resp.choices[0].message;
    ctx.push({
        role: 'assistant',
        content: msg.content
    });
    console.log(`${resp.choices[0].message.role}: ${resp.choices[0].message.content}`);
};
process.stdin.addListener('data', async function (text) {
    const input = text.toString().trim();
    ctx.push({
        role: 'user',
        content: input
    });
    await createChatCompletion();
});
const deleteOlderMessages = () => {
    let contextLength = getContextLength();
    while (contextLength > MAX_TOKENS) {
        for (let i = 0; i < ctx.length; i++) {
            const message = ctx[i];
            if (message.role != 'system') {
                // we wont to keep the system message because of initial context
                ctx.splice(i, 1);
                contextLength = getContextLength();
                console.log('New context length: ' + contextLength);
                break;
            }
        }
    }
};
const getContextLength = () => {
    let length = 0;
    ctx.forEach((message) => {
        if (typeof message.content == 'string') {
            length += encoder.encode(message.content).length;
        }
        else if (Array.isArray(message.content)) {
            message.content.forEach((messageContent) => {
                if (messageContent.type == 'text') {
                    length += encoder.encode(messageContent.text).length;
                }
            });
        }
    });
    return length;
};
