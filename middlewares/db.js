var mysql = require("mysql");
require("dotenv").config();

var db = mysql.createPool(process.env.MYSQL_URI);

db.getConnection((error, conn) => {
  if (error) console.log("MySQL Error:", error);
  else console.log("Connected to MySQL Database");
  conn.release();
});

module.exports = db;
