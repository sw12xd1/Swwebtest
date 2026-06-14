const db = require('../config/db')
const router = require('express').Router()

/**
 * 新增任务
 * body: { text, status, priority, created_at }
 */
router.post('/add', async (req, res) => {
  try {
    const { text, status, priority, created_at, deadline } = req.body
    const sql = `
      INSERT INTO task (text, status, priority, created_at, deadline) 
      VALUES (?, ?, ?, ?, ?)
    `
    await db.query(sql, [text, status, priority, created_at, deadline])
    res.json({ code: 200, message: '新增成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 500, error: err.message })
  }
})

/**
 * 编辑状态
 */
router.put('/update/status/:id', async (req, res) => {
  try {
    const { id } = req.params
    const {status} = req.body
    const sql = `UPDATE task SET status=? WHERE id=?`
    await db.query(sql, [status, id])
    return res.json({ code: 200, message: '编辑状态成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 500, error: err.message })
  }
})

// 编辑任务
router.put('/update/task/:id', async(req, res) => {
  const { id } = req.params
  const { text, priority, created_at, deadline, status } = req.body  // ← 加 status
  const sql = `UPDATE task SET text=?, priority=?, created_at=?, deadline=?, status=? WHERE id=?`
  await db.query(sql, [text, priority, created_at, deadline, status, id])  // ← 加 status
  return res.json({ code: 200, message: '编辑任务成功' })
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


// 获取数据
router.get('/page', async (req, res) => {
  try {
    // 查询全部数据
    const [rows] = await db.query(
      `SELECT id, text, status, priority, 
      DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at, 
      DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline 
      FROM task 
      ORDER BY created_at DESC`
    )

    res.json({
      code: 200,
      data: rows
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