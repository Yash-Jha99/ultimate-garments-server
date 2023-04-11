var mysql = require('mysql')
var db = mysql.createConnection({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
})

db.connect((error, res) => {
    if (error) console.log("MySQL:", error)
    else console.log("Connected to MySQL Database")
})

module.exports = db
