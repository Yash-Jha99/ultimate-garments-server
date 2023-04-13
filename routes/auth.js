const express = require("express")
const Joi = require("joi")
const router = express.Router()
const jwt = require("jsonwebtoken")
const db = require("../middlewares/db")
const {generateAuthToken}=require("../middlewares/tokens")

const validateReq = (req) => {
    const schema = Joi.object({
        mobileNumber: Joi.string().length(10).required()
    })
    return schema.validate(req)
}
const validateOtp = (req) => {
    const schema = Joi.object({
        otp: Joi.string().length(4).required(),
        mobileNumber: Joi.string().length(10).required()
    })
    return schema.validate(req)
}

let otp = ""
const generateOtp = () => Math.ceil(Math.random() * 1000 + 8999).toString()

router.post("/login", (req, res) => {
    const { error } = validateReq(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    otp = generateOtp()

    db.query('select mobile_number from users where mobile_number=?', [req.body.mobileNumber], (err, result) => {
        if (err) console.log(err)
        if (result[0]) return res.status(200).json({ otp, isRegistered: true })
        else return res.status(200).json({ otp, isRegistered: false })
    })
})

router.post("/validate", (req, res) => {
    const { error } = validateOtp(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    if (otp !== req.body.otp) return res.status(400).send("Invalid Otp")

    db.query('select id,name,email,mobile_number as mobileNumber,isAdmin from users where mobile_number=?', [req.body.mobileNumber], (err, result) => {
        if (err) console.log(err)
        if (result[0]) {
            const { id, mobileNumber, email, name,isAdmin }=result[0]
            const token = generateAuthToken({ id, mobileNumber, email, name ,isAdmin})
            return res.status(200).send(token)
        }
        else return res.status(200).send(null)
    })
})





module.exports = router
