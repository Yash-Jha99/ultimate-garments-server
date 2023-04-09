const express = require("express")
const router = express.Router()
const db = require("../middlewares/db")
var uuid = require('uuid').v4

router.post("/", (req, res) => {
    const { productId } = req.body
    const id = uuid()

    db.query('select id from wishlist where product_id=? and user_id=?', [productId, req.user.id], (error, result) => {
        if (error) console.log(error)
        else if (result[0]) res.status(400).send("Product already wishlisted")
        else db.query("insert into wishlist values (?,?,?) ", [id, req.user.id, productId], (err, result) => {
            if (err) console.log(err)
            else
                db.query("select id, name,price,discount,image from products where id= ? ", [productId], (err, result) => {
                    if (err) console.log(err)
                    else res.status(201).json({ ...result[0], wishlistId: id })
                })
        })
    })


})

router.get("/", (req, res) => {
    const { id: userId } = req.user

    db.query("select W.id,P.id as productId, P.name,P.price,P.discount,P.image from products P,wishlist W where P.id=w.product_id and w.user_id=? ", [userId], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ result: false })
        }
        else res.status(200).send(result)
    })
})

router.delete("/:id", (req, res) => {
    const { id } = req.params

    db.query("delete from wishlist where id=? ", [id], (err, result) => {
        if (err) {
            res.status(500).json({ result: false })
        }
        else res.status(200).json({ id: id, message: "Product removed from wishlist" })
    })
})

module.exports = router