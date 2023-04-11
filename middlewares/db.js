var mysql = require('mysql')
var db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
})

db.connect((error, res) => {
    if (error) console.log("MySQL:", error)
    else console.log("Connected to MySQL Database")
})

module.exports = db
