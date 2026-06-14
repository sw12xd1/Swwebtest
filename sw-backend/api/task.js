const db = require('../config/db')
const router = require('express').Router()

/**
 * 新增任务
 * body: { text, status, priority, created_at }
 */
router.post('/add', async (req, res) => {
  try {
    const { text, status, priority, created_at } = req.body
    const sql = `
      INSERT INTO task (text, status, priority, created_at) 
      VALUES (?, ?, ?, ?)
    `
    await db.query(sql, [text, status, priority, created_at])
    res.json({ code: 200, message: '新增成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 500, error: err.message })
  }
})

/**
 * 编辑任务（支持修改全部字段：内容、状态、优先级、时间）
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { text, status, priority, created_at } = req.body
    const sql = `
      UPDATE task 
      SET text=?, status=?, priority=?, created_at=? 
      WHERE id=?
    `
    await db.query(sql, [text, status, priority, created_at, id])
    return res.json({ code: 200, message: '编辑成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 500, error: err.message })
  }
})

/**
 * 删除任务
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await db.query('DELETE FROM task WHERE id = ?', [id])
    res.json({ code: 200, message: '删除成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 500, error: err.message })
  }
})

/**
 * 分页查询任务列表（返回 priority 优先级字段）
 */
router.get('/page', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const offset = (page - 1) * pageSize

    // 总条数
    const [totalResult] = await db.query('SELECT COUNT(*) AS total FROM task')
    const total = totalResult[0].total

    // 查询：带出 priority 字段
    const [rows] = await db.query(
      `SELECT id, text, status, priority, created_at 
       FROM task 
       ORDER BY created_at DESC 
       LIMIT ?, ?`,
      [offset, pageSize]
    )

    res.json({
      code: 200,
      data: rows,
      total: total
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 500, error: err.message })
  }
})

/**
 * 根据ID获取单条任务详情（包含优先级）
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.query(
      'SELECT id, text, status, priority, created_at FROM task WHERE id = ?',
      [id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, message: '任务不存在' })
    }
    res.json({ code: 200, data: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 500, error: err.message })
  }
})

module.exports = router