import { ChatOpenAI } from '@langchain/openai'

// proper named OPENAI key will be add automatically
const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.8,
    maxTokens: 700,
    // verbose get more information about the request
    //verbose: true
});

async function main() {
    // const response1 = await model.invoke(
    //     'Give me 4 good books to read'
    // );
    // console.log(response1.content)
    // const response2 = await model.batch([
    //     'Hello',
    //     'Give me 4 good books to read'
    // ]);
    // console.log(response2)

    const response3 = await model.stream('Give me 4 good books to read');
    for await (const chunk of response3) {
        console.log(chunk.content)
    }
}

main()