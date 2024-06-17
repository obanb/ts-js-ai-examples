"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJSONData = exports.generateEmbeddings = void 0;
const fs_1 = require("fs");
const openai_1 = __importDefault(require("openai"));
const path_1 = require("path");
const openai = new openai_1.default();
async function generateEmbeddings(input) {
    const response = await openai.embeddings.create({
        input: input,
        model: 'text-embedding-3-small'
    });
    return response;
}
exports.generateEmbeddings = generateEmbeddings;
function loadJSONData(fileName) {
    const path = (0, path_1.join)(__dirname, fileName);
    const rawData = (0, fs_1.readFileSync)(path);
    return JSON.parse(rawData.toString());
}
exports.loadJSONData = loadJSONData;
function saveDataToJsonFile(data, fileName) {
    const dataString = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataString);
    const path = (0, path_1.join)(__dirname, fileName);
    (0, fs_1.writeFileSync)(path, dataBuffer);
    console.log(`saved data to ${fileName}`);
}
async function main() {
    const data = loadJSONData('embeddingsData1.json');
    const embeddings = await generateEmbeddings(data);
    const dataWithEmbeddings = [];
    for (let i = 0; i < data.length; i++) {
        dataWithEmbeddings.push({
            input: data[i],
            embedding: embeddings.data[i].embedding
        });
    }
    saveDataToJsonFile(dataWithEmbeddings, 'dataWithEmbeddings1.json');
}
main();
