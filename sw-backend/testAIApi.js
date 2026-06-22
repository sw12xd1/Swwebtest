const fetch = require('node-fetch')

const testAnalyze = async () => {
    const prompt = `
        你是一个温和的心理健康助手，请根据以下数据对用户今天的状态做简短分析（100字以内），给出一句鼓励：

        - 日期：2026-06-09
        - 情绪评分：7 / 10
        - 鼻塞程度：3 / 10
        - 睡眠质量：6 / 10
        - 压力程度：4 / 10
        - 日记内容：今天天气不错，心情还好
    `.trim()

    const aiRes = await fetch('https://www.9527code.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'sk-anDOhBClsXJiUCsOCnnFPTQm6GpH6kPQadXTZaK8Tc8TmtcI',
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'qwen/qwen3-next-80b-a3b-instruct',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }],
        }),
    })

    console.log('状态码:', aiRes.status)
    const aiData = await aiRes.json()
    console.log('返回内容:', JSON.stringify(aiData, null, 2))
}

testAnalyze()