const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const authentication = require('../middleware/authentication')

router.post('/users/register', async (req, res) => {

    try {
        const user = await User.create({
            ...req.body
        })
        const settings = await User.toJSON(user.mobile)
        const token = await User.generateAuthToken(user.id)
        res.status(200).send({ user, token })
    } catch (error) {
        console.log(error)
        res.status(422).send({ error })
    }
})

router.post('/users/login', async (req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await User.generateAuthToken(user.id)

        res.status(200).send({ user, token })
    } catch (error) {
        res.status(422).send({ message: 'Wrong email or password' })
    }

})

router.get('/users/me', authentication, async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (error) {
        res.status(401).send({ error })
    }
})

router.patch('/users/me', authentication, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(422).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    } catch (error) {
        res.status(400).send({ error })
    }
})


router.delete('/users/me', authentication, async (req, res) => {
    try {
        const user = await User.destroy({ where: { id: req.user.id } })
        res.status(200).send({ message: "User was deleted" })

    } catch (error) {
        res.status(500).send({ error })
    }
})


module.exports = router

