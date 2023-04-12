// var mysql = require('mysql')
// var db = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: 'root',
//     password: "1234",
//     database: "ultimate_garments",
// })

// db.connect((error, res) => {
//     if (error) console.log("MySQL:", error)
//     else console.log("Connected to MySQL Database")
// })

// var { Pool } = require('pg')
// const db = new Pool({
//     database: "bcdaiwggs3j602lzbeod",
//     host: "bcdaiwggs3j602lzbeod-postgresql.services.clever-cloud.com",
//     password: "Vd9RWw64n9IQZ1ZU494fdLftMorhaN",
//     port: 5432,
//     user: "ug10elfqnispappodhxy",
//     connectionTimeoutMillis: 5000
// })



db.connect((err) => {
    if (err) console.log(err)
    console.log("Connected to PostgreSQL")

})

module.exports = db