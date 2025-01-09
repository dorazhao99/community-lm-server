import OpenAI from 'openai';
const sysPrompt = `
Is the following knowledge relevant to the prompt? 
Respond with the boolean true if the knowledge is relevant and false if it is NOT relevant. 
You must output just one word 'True' or the word 'False', nothing else.
`



async function chat(client, query, knowledge, name) {
    const prompt = `Knowledge: ${knowledge}\n Prompt: ${query}`

    const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'system', content: sysPrompt }, { role: 'user', content: prompt}],
        model: 'gpt-4o',
        logprobs: true,
        max_completion_tokens: 1
    });
    const logprobs = chatCompletion.choices[0].logprobs.content
    return {module: name, logprob: logprobs}
}

export const queryGPT = async(req, res, next) => {
    const relevantModules = []

    const client = new OpenAI({
        apiKey: '', // This is the default and can be omitted
    });

    const gptCalls = []
    console.log('Body', req.body.modules)
    const moduleKnowledges = JSON.parse(req.body.modules)
    const query = req.body.query 
    
    console.log(Object.keys(moduleKnowledges))
    Object.keys(moduleKnowledges).forEach(name => {
        const module = moduleKnowledges[name]
        gptCalls.push(chat(client, query, module.knowledge, name))
    })

    await Promise.all(gptCalls)
    .then(response => {
        response.forEach(r => {
            r.logprob.forEach(logprob => {
                const p = Math.exp(logprob.logprob)
                console.log(logprob, p)
                if (logprob.token === 'True' && p > 0.5) {
                    relevantModules.push(r.module)
                }
            })
        })
        console.log(relevantModules)
        res.status(200).send(relevantModules)
    });

}
