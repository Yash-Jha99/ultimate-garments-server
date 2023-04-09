var express = require('express');
var router = express.Router();
var db = require('../middlewares/db')
var uuid = require('uuid').v4


router.post('/', (req, res) => {

    const { firstName, lastName, mobileNumber, pinCode, town, city, state, address, isDefault } = req.body
    const id = uuid()
    db.query('insert into addresses values (?,?,?,?,?,?,?,?,?,?)', [id, req.user.id, firstName, lastName, mobileNumber, pinCode, town, city, state, address], (error, result) => {
        if (error) console.log(error)
        else if (isDefault)
            db.query("update users set default_address_id=? where id=?", [id, req.user.id], (err, result) => {
                if (err) console.log(err)
                else return res.status(201).json({ id })
            })
        else return res.status(201).json({ id })

    })
})

router.get('/', (req, res) => {
    db.query('select *,(select default_address_id from users where id=?) as defaultAddressId from addresses where user_id=?', [req.user.id, req.user.id], (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ result: error })
        }
        else {
            return res.status(200).send(result)
        }
    })
})



module.exports = router;