const express = require("express")
const router = express.Router()
const db = require("../middlewares/db")
var uuid = require('uuid').v4

router.post("/", (req, res) => {
    const { productId, quantity, productOptionId } = req.body
    const { id: userId } = req.user
    const id = uuid()

    db.query("insert into cart values (?,?,?,?,?) ", [id, productId, userId, quantity, productOptionId], (err, result) => {
        if (err) console.log(err)
        else
            db.query("select P.id as productId, P.name,P.price,P.discount,P.image,C.quantity,C.product_option_id,C.id from products P join cart C on C.product_id=P.id and C.id=? join product_options PO on PO.id=C.product_option_id join options O on O.id=PO.size_option_id or O.id=PO.color_option_id ", [id], (err, result) => {
                if (err) console.log(err)
                else res.status(201).send(result[0])
            })
    })
})
router.get("/", (req, res) => {
    const { id: userId } = req.user
    db.query("select  P.id as productId, P.name,P.price,P.discount,P.image,C.quantity,C.product_option_id,C.id,(select upper(name) from options where size_option_id = id) as size,(select name from options where color_option_id = id) as color from products P join cart C on C.product_id=P.id and C.user_id=? join product_options PO on PO.id=C.product_option_id ", [userId], (err, result) => {
        if (err) {
            console.log(err)
        }
        else res.status(200).send(result)
    })
})

router.put("/:cartId", (req, res) => {
    const { cartId } = req.params
    const { quantity } = req.body

    db.query("update cart set quantity=? where id=? ", [quantity, cartId], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ result: false })
        }
        else res.status(200).json({ id: cartId, quantity, message: "Cart Updated Succesfully" })
    })
})

router.delete("/:cartId", (req, res) => {
    const { cartId } = req.params

    db.query("delete from cart where id=? ", [cartId], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ result: false })
        }
        else res.status(200).json({ id: cartId, message: "Product removed from cart" })
    })
})

module.exports = router