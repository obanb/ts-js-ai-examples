import { OpenAI } from 'openai'
import { encoding_for_model } from 'tiktoken'

const openai = new OpenAI()

const getTime = () => {
    return '5:30'
}

const getOrderStatus = (orderId: string) => {
    console.log(`Order status for order ${orderId}`)
    const num = parseInt(orderId)
    if(num % 2 === 0) {
        return 'OK'
    }
    return 'PENDING'
}

export const callOpenAiTool = async() => {
    const ctx: OpenAI.Chat.Completions.ChatCompletionMessageParam[]  = [
        {
            role: 'system',
            content: 'you are helpful chatbot that gives information about the time of day and order status'
        },
        {
            role: 'user',
            content: 'what is order status 897?'
        }
    ]

    const resp = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0613',
        messages: ctx,
        tools: [{
            type: 'function',
            function: {
                name: 'getTime',
                description: 'Get the current time'
            }
        },{
            type: 'function',
            function: {
                name: 'getOrderStatus',
                description: 'Get the status of an order',
                parameters: {
                    type: 'object',
                    properties: {
                        orderId: {
                            type: 'string',
                            description: 'The order ID to get status'
                        }
                    },
                    required: ['orderId']
                }
            }
        }],
        tool_choice: 'auto'
    })

    const willInvokeFunction = resp.choices[0].finish_reason === 'tool_calls'
    const toolCall =  resp.choices[0].message.tool_calls![0]

    console.log( resp.choices[0].finish_reason)
    console.log(toolCall)
    console.log(resp.choices[0].message)

    if(willInvokeFunction){
        const toolName = toolCall.function.name
        if(toolName === 'getTime'){
           const toolResponse = getTime()
           ctx.push(resp.choices[0].message)
           ctx.push({
               role: 'tool',
               content: toolResponse,
               tool_call_id: toolCall.id
           })
        }

        if(toolName === 'getOrderStatus'){
            const rawArgs = toolCall.function.arguments
            const parsedArgs = JSON.parse(rawArgs)
            console.log('Parsed args: ', parsedArgs)
            const toolResponse = getOrderStatus(parsedArgs.orderId)
            ctx.push(resp.choices[0].message)
            ctx.push({
                role: 'tool',
                content: toolResponse,
                tool_call_id: toolCall.id
            })
        }
    }

    const secondResp = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0613',
        messages: ctx
    })
    console.log(secondResp.choices[0].message)
}

callOpenAiTool()