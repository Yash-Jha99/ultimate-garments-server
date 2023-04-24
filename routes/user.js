var express = require('express');
var router = express.Router();
var db = require('../middlewares/db');
const { validate } = require('../models/auth');
var uuid = require('uuid').v4
const jwt = require("jsonwebtoken");
const { generateAuthToken } = require('../middlewares/tokens');


router.post('/', (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { name, mobileNumber, email, notify } = req.body
    const id = uuid()

    db.query('select email from users where email=?', [email], (err, result) => {
        if (err) console.log(err)
        if (result[0]) return res.status(400).json({ result: "User already registered" })
        else db.query('insert into users (id,name,mobile_number,email,notify) values (?,?,?,?,?)', [id, name, mobileNumber, email, notify], (error, result) => {
            if (error) return res.status(500).json({ result: error })
            else {
                const token = generateAuthToken({ id, mobileNumber, email, name })
                return res.status(200).send(token)
            }

        })
    })

    // db.query('select mobile_number from users where mobile_number=?', [mobileNumber], (err, result) => {
    //     if (err) console.log(err)
    //     if (result[0]) return res.status(400).json({ result: "Mobile number already registered with another email" })
    // })

})

router.put('/:id', (req, res) => {
    // const { error } = validate(req.body)
    // if (error) return res.status(400).send(error.details[0].message)

    const { firstName, lastName, mobileNumber, notify, gender, dob } = req.body
    const { id } = req.params
    const name = firstName + " " + lastName
    console.log(notify)

    db.query('update users set name=?,mobile_number=?,notify=?,gender=?,dob=? where id=?', [name, mobileNumber, notify, gender, dob, id], (err, result) => {
        if (err) console.log(err)
        else return res.status(200).json({ result: "User updated" })
    })
})


router.get('/:id', (req, res) => {
    db.query('select * from users where id=?', [req.params.id], (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ result: error })
        }
        else {
            return res.status(200).send(result[0])
        }
    })
})




module.exports = router;