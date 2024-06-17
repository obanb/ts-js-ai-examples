"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addData = exports.main = void 0;
const chromadb_1 = require("chromadb");
const client = new chromadb_1.ChromaClient({
    path: 'http://localhost:8000',
});
const embeddingFunction = new chromadb_1.OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY,
    openai_model: 'text-embedding-3-small',
});
const main = async () => {
    const res = await client.createCollection({
        name: 'data-test-2',
    });
    console.log(res);
};
exports.main = main;
const addData = async () => {
    const coll = await client.getCollection({ name: 'data-test-1', embeddingFunction: embeddingFunction });
    const res = await coll.add({
        ids: ['id0'],
        documents: ['entry'],
    });
    console.log(res);
};
exports.addData = addData;
(0, exports.addData)();
