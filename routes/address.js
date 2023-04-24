var express = require("express");
var router = express.Router();
var db = require("../middlewares/db");
const { auth } = require("../middlewares/auth");
var uuid = require("uuid").v4;

router.post("/", auth, (req, res, next) => {
  const {
    firstName,
    lastName,
    mobileNumber,
    pinCode,
    town,
    city,
    state,
    address,
    isDefault,
  } = req.body;
  const id = uuid();
  db.query(
    "insert into addresses values (?,?,?,?,?,?,?,?,?,?)",
    [
      id,
      req.user.id,
      firstName,
      lastName,
      mobileNumber,
      pinCode,
      town,
      city,
      state,
      address,
    ],
    (error, result) => {
      if (error) return next(error);
      else if (isDefault)
        db.query(
          "update users set default_address_id=? where id=?",
          [id, req.user.id],
          (err, result) => {
            if (err) return next(err);
            else return res.status(201).json({ id });
          }
        );
      else return res.status(201).json({ id });
    }
  );
});

router.get("/", auth, (req, res, next) => {
  db.query(
    "select *,(select default_address_id from users where id=?) as defaultAddressId from addresses where user_id=?",
    [req.user.id, req.user.id],
    (error, result) => {
      if (error) return next(error);
      else return res.status(200).send(result);
    }
  );
});

router.delete("/:id", auth, (req, res, next) => {
  db.query(
    "delete from addresses where id=?",
    [req.params.id],
    (error, result) => {
      if (error) return next(error);
      else
        return res.status(200).send({ result: "Address deleted succesfully" });
    }
  );
});

router.put("/:id", auth, (req, res, next) => {
  const {
    firstName,
    lastName,
    mobileNumber,
    pinCode,
    town,
    city,
    state,
    address,
    isDefault,
  } = req.body;
  db.query(
    "update addresses set first_name=?,last_name=?,mobile_number=?,pincode=?,town=?,city=?,state=?,address=? where id=?",
    [
      firstName,
      lastName,
      mobileNumber,
      pinCode,
      town,
      city,
      state,
      address,
      req.params.id,
    ],
    (error, result) => {
      if (error) return next(error);
      else if (isDefault)
        db.query(
          "update users set default_address_id=? where id=?",
          [req.params.id, req.user.id],
          (err, result) => {
            if (err) return next(err);
            else
              return res
                .status(200)
                .json({ result: "Address updated succesfully" });
          }
        );
      else
        return res.status(200).json({ result: "Address updated succesfully" });
    }
  );
});

module.exports = router;
