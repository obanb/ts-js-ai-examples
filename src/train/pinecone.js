"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndex = exports.queryVectors = exports.upsertVectors = exports.generateNumbers = exports.createNamespace = exports.getIndex = exports.listIndexes = exports.main = void 0;
const pinecone_1 = require("@pinecone-database/pinecone");
const pc = new pinecone_1.Pinecone({
    apiKey: process.env.PINECONE_KEY
});
const main = async () => {
    await pc.createIndex({
        name: 'test-index',
        dimension: 1536,
        metric: 'cosine',
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1',
            }
        }
    });
};
exports.main = main;
const listIndexes = async () => {
    const indexes = await pc.listIndexes();
    console.log(indexes);
};
exports.listIndexes = listIndexes;
//string value
//embeddings
//metadata
const getIndex = () => {
    const index = pc.index('test-index');
    return index;
};
exports.getIndex = getIndex;
const createNamespace = () => {
    const index = (0, exports.getIndex)();
    const namespace = index.namespace('test-namespace');
};
exports.createNamespace = createNamespace;
const generateNumbers = (n) => {
    return Array.from({ length: n }, () => Math.random());
};
exports.generateNumbers = generateNumbers;
const upsertVectors = async () => {
    const embeddings = (0, exports.generateNumbers)(1536);
    const index = (0, exports.getIndex)();
    const upsert = await index.upsert([{
            id: 'id-1',
            values: embeddings,
            metadata: {
                coolnes: 3,
                reference: 'abc'
            }
        }]);
};
exports.upsertVectors = upsertVectors;
const queryVectors = async () => {
    const index = (0, exports.getIndex)();
    const res = await index.query({
        id: 'id-1',
        topK: 10,
        includeMetadata: true,
    });
    console.log(res);
};
exports.queryVectors = queryVectors;
const createIndex = async (name) => {
    await pc.createIndex({
        name,
        dimension: 1536,
        metric: 'cosine',
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1',
            }
        }
    });
};
exports.createIndex = createIndex;
(0, exports.queryVectors)();
