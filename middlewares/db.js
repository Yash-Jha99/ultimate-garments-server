var mysql = require("mysql");
require("dotenv").config();

var db = mysql.createConnection(process.env.MYSQL_URI);

module.exports = db;
