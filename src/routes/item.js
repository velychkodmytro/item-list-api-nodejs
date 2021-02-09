const express = require('express')
const router = new express.Router()
const multer = require('multer')
const Item = require('../models/items.js')
const authentication = require('../middleware/authentication')


router.post('/items', authentication, async (req, res) => {

    const item = await Item.create({ ...req.body, owner: req.user.id })
    try {
        res.status(200).send({ item, user: req.user })
    } catch (error) {
        res.status(400).send({ error })

    }
})

router.get('/items', authentication, async (req, res) => {

    try {
        const items = await Item.findAll({
            where: { owner: req.user.id }
        })
        res.status(200).send({ items, user: req.user })
    } catch (error) {
        res.status(404).send({ error })
    }
})

router.get('/items/:id', authentication, async (req, res) => {
    const id = req.params.id
    try {
        const item = await Item.findOne({ where: { id, owner: req.user.id } })
        if (!item) {
            return res.status(404).send({ message: "Not found" })

        }
        res.status(200).send({ item })
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.patch('/items/:id', authentication, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'price']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(422).send({ message: "Invalid Updates" })
    }

    try {
        const item = await Item.findOne({ where: { id: req.params.id } })

        if (!item) {
            return res.status(404).send({ message: "Cannot find an item" })
        }

        updates.forEach((update) => item[update] = req.body[update])
        await item.save()
        res.status(200).send(item)

    } catch (error) {
        res.status(403).send({ error })
    }
})

router.delete('/items/:id', authentication, async (req, res) => {
    try {
        const item = await Item.destroy({ where: { id: req.params.id, owner: req.user.id } })

        if (!item) {
            res.status(404).send({ message: "Cannot find an item" })
        }

        res.status(200).send({ message: "Item was deleted" })
    } catch (error) {
        res.status(422).send({ error })
    }
})


module.exports = router