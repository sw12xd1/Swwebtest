const db = require('../config/db')
const router = require('express').Router()

// 新增
router.post('/add', async (req, res) => {
    try {
        const { created_at, sleepTime, heartRate, isNoise, isBisai, isSugar, isTooLate, sleepQuality } = req.body
        await db.query(
            `INSERT INTO sleep (created_at, sleepTime, heartRate, isNoise, isBisai, isSugar, isTooLate, sleepQuality) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [created_at, sleepTime, heartRate, isNoise, isBisai, isSugar, isTooLate, sleepQuality]
        )
        res.json({ code: 200, message: '新增成功' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ code: 500, error: err.message })
    }
})

// 编辑
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { created_at, sleepTime, heartRate, isNoise, isBisai, isSugar, isTooLate, sleepQuality } = req.body
        await db.query(
            `UPDATE sleep 
             SET created_at=?, sleepTime=?, heartRate=?, isNoise=?, isBisai=?, isSugar=?, isTooLate=?, sleepQuality=? 
             WHERE id=?`,
            [created_at, sleepTime, heartRate, isNoise, isBisai, isSugar, isTooLate, sleepQuality, id]
        )
        return res.json({ code: 200, message: '编辑成功' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ code: 500, error: err.message })
    }
})

// 删除
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await db.query('DELETE FROM sleep WHERE id = ?', [id])
        res.json({ code: 200, message: 'sleep deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

// 分页
router.get('/page', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.pageSize) || 10
        const offset = (page - 1) * pageSize

        const [totalResult] = await db.query('SELECT COUNT(*) AS total FROM sleep')
        const total = totalResult[0].total

        const [rows] = await db.query(
            `SELECT 
                id,
                DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
                sleepTime,
                heartRate,
                isNoise,
                isBisai,
                isSugar,
                isTooLate,  
                sleepQuality
             FROM sleep 
             ORDER BY created_at DESC 
             LIMIT ?, ?`,
            [offset, pageSize]
        )

        res.json({ code: 200, data: rows, total })
    } catch (err) {
        res.status(500).json({ code: 500, error: err.message })
    }
})
router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params
        const [rows] = await db.query(
            'SELECT sleepQuality FROM sleep WHERE DATE(created_at) = ? LIMIT 1',
            [date]
        )
        res.json({ code: 200, data: rows[0] || null })
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
                sleepTime,
                heartRate,
                isNoise,
                isBisai,
                isSugar,
                isTooLate,
                sleepQuality
             FROM sleep WHERE id = ?`,
            [id]
        )
        if (rows.length === 0) {
            return res.status(404).json({ code: 404, message: 'sleep not found' })
        }
        res.json({ code: 200, data: rows[0] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ code: 500, error: err.message })
    }
})

module.exports = router