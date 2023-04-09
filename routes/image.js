const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/:name", (req, res) => {
    const imagePath = path.join(__dirname, "../public/images", req.params.name)
    res.sendFile(imagePath)
})

module.exports = router