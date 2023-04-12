const express = require("express");
const db = require("../middlewares/db");
const router = express.Router();
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", (req, res, next) => {
    const { cartsId } = req.body
    const ids = cartsId.map(id => `'${id}'`).join(",")
    const query = `select p.name,p.price,c.quantity from cart c join products p on c.product_id=p.id where c.id in (${ids})`
    db.query(query, async (err, result) => {
        if (err) next(err)
        else {
            console.log(result, cartsId, ids)
            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: result.map(product => ({
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: product.name,
                            },
                            unit_amount: product.price * 100,
                        },
                        quantity: product.quantity,
                    })),
                    mode: "payment",
                    success_url: process.env.PAYMENT_SUCCESS_URL,
                    cancel_url: process.env.PAYMENT_CANCEL_URL,
                });
                res.status(200).json({ url: session.url })
            } catch (error) {
                next(error)
            }
        }
    })
})


module.exports = router


