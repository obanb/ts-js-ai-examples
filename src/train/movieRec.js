"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const embeddings_1 = require("./embeddings");
const embeddingSimilarity_1 = require("./embeddingSimilarity");
const path_1 = require("path");
const fs_1 = require("fs");
const data = loadJSONData('movies.json');
console.log('What movies do you like?');
console.log('...............');
process.stdin.addListener('data', async function (input) {
    let userInput = input.toString().trim();
    await recommendMovies(userInput);
});
async function recommendMovies(input) {
    const embedding = await (0, embeddings_1.generateEmbeddings)(input);
    const descriptionEmbeddings = await getMovieEmbeddings();
    const moviesWithEmbeddings = [];
    for (let i = 0; i < data.length; i++) {
        moviesWithEmbeddings.push({
            name: data[i].name,
            description: data[i].description,
            embedding: descriptionEmbeddings.data[i].embedding
        });
    }
    const similarities = [];
    for (const movie of moviesWithEmbeddings) {
        const similarity = (0, embeddingSimilarity_1.dotProduct)(movie.embedding, embedding.data[0].embedding);
        similarities.push({
            input: movie.name,
            similarity
        });
    }
    console.log(`If you like ${input}, we recommend:`);
    console.log('...............');
    const sortedSimilarity = similarities.sort((a, b) => b.similarity - a.similarity);
    sortedSimilarity.forEach(similarity => {
        console.log(`${similarity.input}: ${similarity.similarity}`);
    });
}
async function getMovieEmbeddings() {
    const fileName = 'movieEmbeddings.json';
    const filePath = (0, path_1.join)(__dirname, fileName);
    if ((0, fs_1.existsSync)(filePath)) {
        const descriptionEmbeddings = loadJSONData(fileName);
        return descriptionEmbeddings;
    }
    else {
        const descriptionEmbeddings = await (0, embeddings_1.generateEmbeddings)(data.map(d => d.description));
        saveDataToJsonFile(descriptionEmbeddings, fileName);
        return descriptionEmbeddings;
    }
}
function loadJSONData(fileName) {
    const path = (0, path_1.join)(__dirname, fileName);
    const rawData = (0, fs_1.readFileSync)(path);
    return JSON.parse(rawData.toString());
}
function saveDataToJsonFile(data, fileName) {
    const dataString = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataString);
    const path = (0, path_1.join)(__dirname, fileName);
    (0, fs_1.writeFileSync)(path, dataBuffer);
    console.log(`saved data to ${fileName}`);
}
