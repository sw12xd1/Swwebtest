const express = require('express')
const app = express()
const cors = require('cors');
const PORT = 3000
const pool = require('./config/db')

app.use(express.json())
app.use(cors());

// 增加
app.get('/api/bisai/', async (req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM bisai')
        res.json(rows)
    }
    catch(err){
        console.error(err)
        res.status(500).json({error: err.message})
    }
})

// 删除
app.delete('/api/bisai/:id', async (req, res) => {
    try{
        const {id} = req.params
        await pool.query('DELETE FROM bisai WHERE id = ?', [id])
        res.json({message: 'bisai deleted successfully'})
    }
    catch(err){
        console.error(err)
        res.status(500).json({error: err.message})
    }
})

// 修改
app.put('/api/bisai/:id', async (req, res) => {

    try{
        const {id} = req.params
        const body = req.body

        const allowed = ['isIceFood','isCold','isSelf','isSpray','moodDegree','bisaiDegree'];
        const fields = [];
        const values = [];

        for (const key of allowed) {
            if (body[key] !== undefined) {
              fields.push(`${key} = ?`);
              values.push(body[key]);
            }
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: '没有要更新的字段' });
          }
      
        // 拼接动态 SQL
        const sql = `UPDATE bisai SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id); 

        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '未找到该记录' });
        }

        res.json({ code: 200, message: '更新成功' });
    }   
    catch(err){
        console.error(err)
        res.status(500).json({ code: 500, error: err.message });
    }
})

// 分页
// 分页查询接口 ✅ 完整可用
app.get('/api/bisai/page', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.pageSize) || 10
      const offset = (page - 1) * pageSize
  
      // 查询总数
      const [totalResult] = await pool.query('SELECT COUNT(*) AS total FROM bisai')
      const total = totalResult[0].total
  
      // 查询当前页数据
      const [rows] = await pool.query(
        'SELECT * FROM bisai ORDER BY id DESC LIMIT ?, ?',
        [offset, pageSize]
      )
  
      res.json({
        code: 200,
        data: rows,
        total: total
      })
    } catch (err) {
      res.status(500).json({ code: 500, error: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

