const jwt = require("jsonwebtoken")


const generateAccessToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_ACCESS_KEY)
}

const refreshAccessToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_ACCESS_KEY)
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_ACCESS_KEY)
}

const generateAuthToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_AUTH_KEY)
}

const verifyAuthToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_AUTH_KEY)
}

module.exports = {
    generateAccessToken,
    generateAuthToken,
    verifyAccessToken,
    verifyAuthToken,
    refreshAccessToken
}