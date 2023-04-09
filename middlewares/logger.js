const morgan = require('morgan');

const logger = (req, res, next) => {
    const logs = []
    logs.push("%c" + req.method)
    logs.push("%c" + req.originalUrl || req.url)
    logs.push("color:green,fontWeight:bold;")
    logs.push("colo")
    logs.push("%c" + req.method)
    logs.push("%c" + req.method)
    next()

}

module.exports = logger