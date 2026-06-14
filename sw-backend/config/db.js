const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'sw12',
    timezone: 'Z',
    decimalNumbers: true
});

// 测试连接
(async () => {
    try {
      const [rows] = await pool.query('SELECT 1');
      console.log('✅ 数据库连接成功');
    } catch (err) {
      console.error('❌ 数据库连接失败：', err);
    }
  })();

module.exports = pool;