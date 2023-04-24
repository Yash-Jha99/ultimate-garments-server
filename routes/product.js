var express = require("express");
var router = express.Router();
var db = require("../middlewares/db");

router.get("/category", (req, res) => {
  db.query("select * from category", (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ result: error });
    } else {
      return res.status(200).json({ result });
    }
  });
});

router.get("/:name", (req, res, next) => {
  let product = { wishlistId: null };

  db.query(
    "select * from products where name=?",
    [req.params.name],
    (error, result) => {
      if (error) next(error);
      else if (!result[0]) return res.status(404).send("Product Not Found");
      else product = { ...result[0], ...product };
      db.query(
        "select id,upper(name) as name,price_inc from options where id in (select size_option_id from product_options where product_id=?) order by id",
        [product.id],
        (error, result) => {
          if (error) next(error);
          else product.sizes = result;
          db.query(
            "select id as productOptionId, color_option_id as colorId,size_option_id as sizeId,quantity_in_stock as quantityInStock from product_options where product_id=(select id from products where name=?)",
            [req.params.name],
            (err, result) => {
              if (err) next(err);
              else product.options = result;
              db.query(
                "select id,name as label,value,price_inc from options where id in (select color_option_id from product_options where product_id=?)",
                [product.id],
                (error, result) => {
                  if (error) next(error);
                  else product.colors = result;
                  if (req.user)
                    db.query(
                      "select id from wishlist where product_id=? and user_id=?",
                      [product.id, req.user.id],
                      (error, result) => {
                        if (error) next(error);
                        else if (result[0]) product.wishlistId = result[0].id;
                        return res.status(200).send(product);
                      }
                    );
                  else return res.status(200).send(product);
                }
              );
            }
          );
        }
      );
    }
  );
});

router.get("/", (req, res, next) => {
  const { size, color, search, price, category } = req.query;
  console.log(req.query);

  let sizeFilter, colorFilter;
  let query = `select distinct p.id ,p.name,p.price,p.discount,p.image,${
    req.user ? "w.id" : null
  } as wishlistId from products p `;

  if (category)
    query += `join category c on c.id=p.category_id and c.name="${category}"`;

  if (search) query += `join category c on c.id=p.category_id`;

  if (size || color) {
    sizeFilter = size
      ?.split("+")
      .map((f) => `'${f}'`)
      .join(",");

    colorFilter = color
      ?.split("+")
      .map((f) => `'${f}'`)
      .join(",");

    query += `join product_options po on po.product_id=p.id`;
  }

  if (sizeFilter)
    query += ` join options o1 on po.size_option_id=o1.id and o1.name in (${sizeFilter}) `;

  if (colorFilter)
    query += ` join options o2 on po.color_option_id=o2.id and o2.name in (${colorFilter})`;

  if (req.user) {
    query += ` left join wishlist w on p.id = w.product_id and w.user_id = "${req?.user?.id}"`;
  }

  if (search) {
    query += ` where lower(c.name) like "%${search.toLowerCase()}%" or lower(p.name) like "%${search.toLowerCase()}%"`;
  }

  db.query(query, (error, result) => {
    if (error) return next(error);
    else return res.status(200).send(result);
  });
});

router.get("/subcategory/:categoryid", (req, res) => {
  db.query(
    "select * from subcategory where category_id=?",
    [req.params.categoryid],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ result: error });
      } else {
        return res.status(200).json({ result: result });
      }
    }
  );
});

router.get("/options/:option", (req, res) => {
  db.query(
    `select id,name,value,price_inc from options where type=? `,
    [req.params.option],
    (error, result) => {
      if (error) {
        return res.status(500).json({ result: error });
      } else {
        return res.status(200).send(result);
      }
    }
  );
});

router.get("/:id/:option", (req, res) => {
  const { option, id } = req.params;
  db.query(
    `select o.*,po.id as productOptionId from product_options po join options o on po.${option}_option_id=o.id and po.product_id=? `,
    [id],
    (error, result) => {
      if (error) console.log(error);
      else res.status(200).send(result);
    }
  );
});

module.exports = router;
