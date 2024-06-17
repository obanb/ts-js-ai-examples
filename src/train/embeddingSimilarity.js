"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotProduct = void 0;
const embeddings_1 = require("./embeddings");
// https://en.wikipedia.org/wiki/Dot_product
// measure describing the total quantity of effort in the same direction
function dotProduct(a, b) {
    return a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
}
exports.dotProduct = dotProduct;
// https://en.wikipedia.org/wiki/Cosine_similarity
// direction after normalization to have same magnitude
// what percentage of the effort is in the same direction
// dot product, scaled by magnitude
function cosineSimilarity(a, b) {
    const product = dotProduct(a, b);
    const aMagnitude = Math.sqrt(a.map(value => value * value).reduce((a, b) => a + b, 0));
    const bMagnitude = Math.sqrt(b.map(value => value * value).reduce((a, b) => a + b, 0));
    return product / (aMagnitude * bMagnitude);
}
async function main() {
    const dataWithEmbeddings = (0, embeddings_1.loadJSONData)('dataWithEmbeddings1.json');
    const input = 'dragon prase zase';
    const inputEmbedding = await (0, embeddings_1.generateEmbeddings)(input);
    const similarities = [];
    for (const entry of dataWithEmbeddings) {
        // dotProduct or cosineSimilarity can be used
        const similarity = dotProduct(entry.embedding, inputEmbedding.data[0].embedding);
        similarities.push({
            input: entry.input,
            similarity
        });
    }
    console.log(`Similarity of ${input} with:`);
    const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);
    sortedSimilarities.forEach(similarity => {
        console.log(`${similarity.input}: ${similarity.similarity}`);
    });
}
main();
