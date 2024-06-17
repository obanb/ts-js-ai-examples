import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
    apiKey: process.env.PINECONE_KEY!
});


export const main = async() => {
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
    })
}

export const listIndexes = async() => {
    const indexes = await pc.listIndexes()
    console.log(indexes)
}

//string value
//embeddings
//metadata
export const getIndex = () => {
    const index = pc.index('test-index')
    return index
}

export const createNamespace = () => {
    const index = getIndex()
    const namespace = index.namespace('test-namespace')
}

export const generateNumbers = (n: number) => {
    return Array.from({length: n}, () => Math.random())
}

export const upsertVectors = async() => {
    const embeddings = generateNumbers(1536);
    const index = getIndex()

    const upsert = await index.upsert([{
        id: 'id-1',
        values: embeddings,
        metadata: {
            coolnes: 3,
            reference: 'abc'
        }
    }])
}

export const queryVectors = async() => {
    const index = getIndex()
    const res = await index.query({
        id: 'id-1',
        topK: 10,
        includeMetadata: true,
    })

    console.log(res)
}

export const createIndex = async(name: string) => {
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
    })
}

queryVectors()