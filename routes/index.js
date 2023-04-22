const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "ultimate garments server" });
});

module.exports = router;
