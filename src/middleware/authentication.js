const jwt = require('jsonwebtoken')
const User = require('../models/user')


const authentication = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewtoken')
        const user = await User.findOne({ where: { id: decoded.id } })

        if (!user) {
            throw new Error('Dont find user')
        }

        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = authentication