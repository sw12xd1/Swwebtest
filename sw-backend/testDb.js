var mysql = require("mysql");

var hostname = "0zzcn4.h.filess.io";
var database = "sw12_somehowpay";
var port = "3307";
var username = "sw12_somehowpay";
var password = "3e7afd4b6d7bca0fe05251e48daf6a9cec86762a";

var con = mysql.createConnection({
  host: hostname,
  user: username,
  password,
  database,
  port,
});


const createSleepSQL = `
CREATE TABLE IF NOT EXISTS \`sleep\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`created_at\` date NOT NULL,
  \`heartRate\` int DEFAULT NULL,
  \`isNoise\` tinyint(1) DEFAULT '0',
  \`isBisai\` tinyint(1) DEFAULT '0',
  \`isSugar\` tinyint(1) DEFAULT '0',
  \`isTooLate\` tinyint(1) DEFAULT '0',
  \`sleepQuality\` int DEFAULT NULL,
  \`sleepTime\` varchar(5) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createTaskSQL = `
CREATE TABLE IF NOT EXISTS \`task\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT COMMENT '任务ID，主键',
  \`text\` varchar(500) NOT NULL COMMENT '任务内容',
  \`status\` tinyint NOT NULL DEFAULT '0' COMMENT '任务状态 0-未完成 1-已完成',
  \`created_at\` date NOT NULL COMMENT '创建时间',
  \`deadline\` date DEFAULT NULL COMMENT '截至时间，可为空',
  \`priority\` enum('urgent','plan','busy','free') NOT NULL DEFAULT 'plan',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='任务表';
`;

con.connect(function (err) {
  if (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
  console.log("Connected!");

    // 创建 sleep 表
    con.query(createSleepSQL, function (err, result) {
      if (err) {
        console.error("Create sleep table failed:", err);
      } else {
        console.log("Table `sleep` created successfully");
      }

      // 创建 task 表
      con.query(createTaskSQL, function (err, result) {
        if (err) {
          console.error("Create task table failed:", err);
        } else {
          console.log("Table `task` created successfully");
        }

        // 查询当前数据库有多少张表
        con.query("SHOW TABLES", function (err, rows) {
          if (err) {
            console.error("Show tables failed:", err);
          } else {
            console.log("当前数据库表数量:", rows.length);
            console.log("表列表:", rows.map(r => Object.values(r)[0]));
          }
          con.end();
        });
      });
    });
});