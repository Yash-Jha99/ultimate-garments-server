var mysql = require('mysql')
var db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: "1234",
    database: "ultimate_garments",
})

db.connect((error, res) => {
    if (error) console.log("MySQL:", error)
    else console.log("Connected to MySQL Database")
})

module.exports = db