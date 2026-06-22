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
  if (err) throw err;
  console.log("Connected!");
});

con.query("SELECT 1+1").on("result", function (row) {
  console.log(row);
});
