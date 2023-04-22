var mysql = require("mysql");
require("dotenv").config();

var db = mysql.createConnection(process.env.MYSQL_URI);

db.connect((error) => {
  if (error) console.log("MySQL Error:", error);
  else console.log("Connected to MySQL Database");
});

// var { Client } = require("pg");
// const db = new Client(process.env.POSTGRESQL_URI);

// db.connect((err) => {
//   if (err) console.log(err);
//   else console.log("Connected to PostgreSQL");
// });

module.exports = db;
