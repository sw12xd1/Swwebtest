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



con.connect(function (err) {
  if (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
  console.log("Connected!");

  // 修改 sleepQuality 字段为 decimal(4,1)
  con.query(
    "ALTER TABLE sleep MODIFY COLUMN sleepQuality decimal(2,1) DEFAULT NULL",
    function (err, result) {
      if (err) {
        console.error("修改 sleepQuality 失败:", err);
      } else {
        console.log("sleepQuality 已改为 decimal(4,1)");
      }
      con.end();
    }
  );
});