var mysql = require("mysql");
require("dotenv").config();

var db = mysql.createConnection(process.env.MYSQL_URI);

db.connect((err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else console.log("Connected to MySQL");
});

module.exports = db;
