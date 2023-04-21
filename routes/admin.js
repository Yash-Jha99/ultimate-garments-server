var express = require("express");
var router = express.Router();
var db = require("../middlewares/db");
var upload = require("../middlewares/multer");
const { admin, auth } = require("../middlewares/auth");
var uuid = require("uuid").v4;

router.post("/category", [auth, admin, upload.single("icon")], (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  const image = baseUrl + "/img/" + req.file.filename;
  db.query(
    "insert into category (id,name,icon) values (?,?,?)",
    [uuid(), req.body.category, image],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ result: error });
      } else {
        return res.status(200).json({ result: true });
      }
    }
  );
});

router.post(
  "/subcategory",
  [auth, admin, upload.single("icon")],
  (req, res) => {
    const baseUrl = req.protocol + "://" + req.get("host");
    const image = baseUrl + "/img/" + req.file.filename;
    db.query(
      "insert into subcategory (id,name,icon,category_id) values (?,?,?,?)",
      [uuid(), req.body.subcategory, image, req.body.categoryid],
      (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ result: error });
        } else {
          return res.status(200).json({ result: true });
        }
      }
    );
  }
);

router.post("/product", [auth, admin, upload.single("image")], (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  const image = baseUrl + "/img/" + req.file.filename;
  const {
    name,
    price,
    category,
    subcategory,
    discount,
    description,
    rating,
    sizes,
    colors,
  } = req.body;
  console.log(sizes, colors);
  const pid = uuid();
  let query = "insert into product_options values ";
  sizes
    .split(",")
    .forEach(
      (size) =>
        (query = query.concat("('", pid, "','", size, "','", "size", "'),"))
    );
  colors
    .split(",")
    .forEach(
      (color) =>
        (query = query.concat("('", pid, "','", color, "','", "color", "'),"))
    );
  query = query.slice(0, -1);

  db.query(
    "insert into products (id,name,price,category_id,subcategory_id,discount,description,rating,image) values (?,?,?,?,?,?,?,?,?)",
    [
      pid,
      name,
      price,
      category,
      subcategory,
      discount,
      description,
      rating,
      image,
    ],
    (error, result) => {
      if (error) console.log(error);
      console.log(result);
    }
  );

  db.query(query, (err, result) => {
    if (err) console.log(err);
  });

  return res.status(200).json({ result: true });
});

module.exports = router;
