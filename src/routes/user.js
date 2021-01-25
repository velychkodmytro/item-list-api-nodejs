const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const authentication = require('../middleware/authentication')


router.post('/users/register', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(422).send(error)
    }
})

router.get('/users/me', authentication, async (req, res) => {
    res.send(req.user)
})




router.patch('/users/me', authentication, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {


        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', authentication, async (req, res) => {
    try {

        await req.user.remove()

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})



module.exports = router