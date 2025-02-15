var jwt = require('jsonwebtoken')
let jwtSecret = 'secret'

let checkToken = (req, res, next) => {
    let token = req.headers.authorization
    // console.log(token, "token")
    try {
        var decoded = jwt.verify(token, jwtSecret)
        // console.log(decoded)
        req.user = decoded._id
        next()
    } catch (error) {
        return res.json({ msg: 'Invalid Token', success: false,error:error.message })
    }
}

module.exports = checkToken