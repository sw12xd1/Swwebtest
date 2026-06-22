const db = require('../config/db')
const router = require('express').Router()
const fetch = require('node-fetch')

const analyzeAndSave = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM diary WHERE id = ?', [id])
        if (rows.length === 0) return
        const diary = rows[0]
        const prompt = `
        你是一位温暖、专业的心理健康助手。请根据用户今天的日记内容，给出一段充实、简短、有温度的状态分析，并附上一句真诚的鼓励。
        【今日日记】
        ${diary.content || '（用户今天未填写日记）'}
        【要求】
        - 分析控制在150字以内
        - 语气温和、自然，像朋友在聊天
        - 最后一句给出鼓励，要真诚不要空洞
        - 直接输出内容，不要加任何标题或前缀
        `.trim()

        console.log(`日记${id} 开始分析`)
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
        const aiContent = aiData.content?.[0]?.text || ''
        await db.query('UPDATE diary SET aiContent=? WHERE id=?', [aiContent, id])
        console.log(`日记${id} AI 返回：${aiContent}`)

    } catch (err) {
        console.error(`日记 ${id} AI 分析失败`, err)
    }
}

// 新增
router.post('/add', async (req, res) => {
    try {
        const { created_at, moodScore, bisaiDegree, sleepQuality, stressLevel, content } = req.body
        const [result] = await db.query(
            `INSERT INTO diary (created_at, moodScore, bisaiDegree, sleepQuality, stressLevel, content) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [created_at, moodScore, bisaiDegree, sleepQuality, stressLevel, content]
        )
        res.json({ code: 200, message: '新增成功' })
        analyzeAndSave(result.insertId)
    } catch (err) {
        console.error(err)
        res.status(500).json({ code: 500, error: err.message })
    }
})

// 编辑
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { created_at, moodScore, bisaiDegree, sleepQuality, stressLevel, content } = req.body
        await db.query(
            `UPDATE diary 
            SET created_at=?, moodScore=?, bisaiDegree=?, sleepQuality=?, stressLevel=?, content=?
            WHERE id=?`,
            [created_at, moodScore, bisaiDegree, sleepQuality, stressLevel, content, id]
        )
        res.json({ code: 200, message: '编辑成功' })
        analyzeAndSave(id)
    } catch (err) {
        console.error(err)
        res.status(500).json({ code: 500, error: err.message })
    }
})

// 删除
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await db.query('DELETE FROM diary WHERE id = ?', [id])
        res.json({ code: 200, message: 'diary deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

// 分页（LEFT JOIN 关联 bisai 和 sleep）
router.get('/page', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 10
        const offset = (page - 1) * pageSize

        const [totalResult] = await db.query('SELECT COUNT(*) AS total FROM diary')
        const total = totalResult[0].total

        const [rows] = await db.query(
            `SELECT 
                diary.id,
                DATE_FORMAT(diary.created_at, '%Y-%m-%d') AS created_at,
                diary.moodScore,
                diary.stressLevel,
                diary.content,
                diary.aiContent,                
                COALESCE(bisai.bisaiDegree, 5) AS bisaiDegree,
                COALESCE(sleep.sleepQuality, 5) AS sleepQuality
             FROM diary diary
             LEFT JOIN bisai bisai ON DATE(diary.created_at) = DATE(bisai.created_at)
             LEFT JOIN sleep sleep ON DATE(diary.created_at) = DATE(sleep.created_at)
             ORDER BY diary.id DESC
             LIMIT ?, ?`,
            [offset, pageSize]
        )

        res.json({ code: 200, data: rows, total })
    } catch (err) {
        res.status(500).json({ code: 500, error: err.message })
    }
})

// 获取某一行
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const [rows] = await db.query(
            `SELECT 
                id,
                DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
                moodScore,
                bisaiDegree,
                sleepQuality,
                stressLevel,
                content,
                aiContent
             FROM diary WHERE id = ?`,
            [id]
        )
        if (rows.length === 0) {
            return res.status(404).json({ code: 404, message: 'diary not found' })
        }
        res.json({ code: 200, data: rows[0] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ code: 500, error: err.message })
    }
})
module.exports = router