const express = require("express")
const router = express.Router()
const db = require("../middlewares/db")
var uuid = require('uuid').v4

router.post("/", (req, res, next) => {
    const { products, addressId, paymentType } = req.body
    const { id: userId } = req.user
    const orderId = uuid()
    const paymentId = uuid()

    const amount = products.reduce((total, item) => total + item.price * item.quantity, 0)

    const query = "insert into order_items values " + products.map(({ id, quantity, price, optionId }) => {
        const orderItemId = uuid()
        return `('${orderItemId}','${orderId}','${id}','${optionId}','${quantity}','${price}')`
    }).join(',')

    db.query(query, (err, result) => {
        if (err) next(err)
        else
            db.query("insert into payments values (?,?,?,current_timestamp(),'PENDING') ", [paymentId, paymentType, amount], (err, result) => {
                if (err) next(err)
                else db.query("insert into orders values (?,?,?,?,current_timestamp()) ", [orderId, userId, paymentId, addressId], (err, result) => {
                    if (err) next(err)
                    else res.status(201).send({ id: orderId })
                })
            })
    })
})
router.get("/", (req, res, next) => {
    const { id: userId } = req.user
    db.query("select O.id,P.name,P.price,P.image,date_format(O.date,'%b %d, %Y') as date ,OI.id as orderItemId from orders O join order_items OI on OI.order_id=O.id and O.user_id=? join products P on P.id=OI.product_id ", [userId], (err, result) => {
        if (err) return next(err)
        else res.status(200).send(result)
    })
})

router.get("/:orderId/:orderItemId", (req, res, next) => {
    const { orderId, orderItemId } = req.params


    db.query("select P.name,P.price,P.image,date_format(O.date,'%b %d, %Y') as date , A.*,O.id,(select upper(name) from options where PO.size_option_id = id) as size,(select name from options where  PO.color_option_id = id) as color from orders O join order_items OI on OI.order_id=O.id and O.id=? and OI.id=? join products P on P.id=OI.product_id join addresses A on A.id=O.address_id join product_options PO on PO.id=OI.product_option_id  ", [orderId, orderItemId], (err, result) => {
        if (err) next(err)
        else res.status(200).send(result[0])
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