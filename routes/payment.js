const express = require("express");
const db = require("../middlewares/db");
const { auth } = require("../middlewares/auth");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", auth, (req, res, next) => {
  const { orderItemIds } = req.body;
  console.log(orderItemIds);
  const ids = orderItemIds.map((id) => `'${id}'`).join(",");
  const query = `select p.name,p.price,oi.quantity from order_items oi join products p on oi.product_id=p.id where oi.id in (${ids})`;
  db.query(query, async (err, result) => {
    if (err) next(err);
    else {
      try {
        console.log(result, query);
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: result.map((product) => ({
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
          success_url: process.env.PAYMENT_SUCCESS_URL + "?success=true",
          cancel_url: process.env.PAYMENT_CANCEL_URL + "?success=false",
        });
        res.status(200).json({ url: session.url });
      } catch (error) {
        next(error);
      }
    }
  });
});

router.put("/status/:id", auth, (req, res, next) => {
  const { status } = req.body;
  db.query(
    "update payments set status=? where id=?",
    [status, req.params.id],
    (err, res) => {
      if (err) return next(err);
      else res.status(200).json({ id: req.params.id });
    }
  );
});

module.exports = router;
