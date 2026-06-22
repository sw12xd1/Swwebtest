const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '0zzcn4.h.filess.io',
    user: 'sw12_somehowpay',
    password: '3e7afd4b6d7bca0fe05251e48daf6a9cec86762a',
    database: 'sw12_somehowpay',
    port: 3307,
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