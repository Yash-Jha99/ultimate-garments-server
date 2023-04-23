const express = require("express");
const router = express.Router();
const db = require("../middlewares/db");
const { auth } = require("../middlewares/auth");
var uuid = require("uuid").v4;

router.post("/", auth, (req, res, next) => {
  const { products, addressId, paymentType } = req.body;
  const { id: userId } = req.user;
  const orderId = uuid();
  const paymentId = uuid();

  const amount = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const query1 =
    "insert into order_items values " +
    products
      .map(({ id, quantity, price, optionId }) => {
        const orderItemId = uuid();
        return `('${orderItemId}','${orderId}','${id}','${optionId}','${quantity}','${price}')`;
      })
      .join(",");

  const query2 =
    "delete from cart where id in (" +
    products.map((item) => `'${item.cartId}'`).join(",") +
    ")";

  db.query(query1, (err, result) => {
    if (err) return next(err);
    else
      db.query(
        "insert into payments values (?,?,?,current_timestamp(),'PENDING') ",
        [paymentId, paymentType, amount],
        (err, result) => {
          if (err) return next(err);
          else
            db.query(
              "insert into orders values (?,?,?,?,'ORDERED',current_timestamp(),null,null,null) ",
              [orderId, userId, paymentId, addressId],
              (err, result) => {
                if (err) return next(err);
                else
                  db.query(query2, (err, result) => {
                    if (err) return next(err);
                    else
                      db.query(
                        "select id from order_items where order_id=?",
                        [orderId],
                        (err, result) => {
                          if (err) return next(err);
                          else res.status(201).send(result);
                        }
                      );
                  });
              }
            );
        }
      );
  });
});
router.get("/", auth, (req, res, next) => {
  const { id: userId } = req.user;
  db.query(
    "select O.id,O.status,P.name,P.price,P.image,date_format(O.o_date,'%b %d, %Y') as orderedDate ,OI.id as orderItemId from orders O join order_items OI on OI.order_id=O.id and O.user_id=? join products P on P.id=OI.product_id order by O.o_date desc ",
    [userId],
    (err, result) => {
      if (err) return next(err);
      else res.status(200).send(result);
    }
  );
});

router.get("/:orderId/:orderItemId", auth, (req, res, next) => {
  const { orderId, orderItemId } = req.params;

  db.query(
    "select P.name,P.price,P.image,O.status,date_format(O.o_date,'%b %d, %Y') as oDate ,date_format(O.p_date,'%b %d, %Y') as pDate ,date_format(O.s_date,'%b %d, %Y') as sDate ,date_format(O.d_date,'%b %d, %Y') as dDate , A.*,O.id,(select upper(name) from options where PO.size_option_id = id) as size,(select name from options where  PO.color_option_id = id) as color,PY.type as paymentType from orders O join order_items OI on OI.order_id=O.id and O.id=? and OI.id=? join products P on P.id=OI.product_id join addresses A on A.id=O.address_id join product_options PO on PO.id=OI.product_option_id join payments PY on O.payment_id=PY.id",
    [orderId, orderItemId],
    (err, result) => {
      if (err) next(err);
      else res.status(200).send(result[0]);
    }
  );
});

router.delete("/:cartId", auth, (req, res) => {
  const { cartId } = req.params;

  db.query("delete from cart where id=? ", [cartId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ result: false });
    } else
      res
        .status(200)
        .json({ id: cartId, message: "Product removed from cart" });
  });
});

module.exports = router;
