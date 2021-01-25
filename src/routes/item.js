const express = require('express')
const router = new express.Router()
const multer = require('multer')
const Item = require('../models/items.js')
const authentication = require('../middleware/authentication')


router.post('/items', authentication, async (req, res) => {

    const item = new Item({
        ...req.body,
        owner: req.user,
    })

    try {
        await item.save()
        res.status(200).send(item)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/items', authentication, async (req, res) => {

    try {
        const items = await Item.find({ owner: req.user._id }).populate('owner')

        res.send(items)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/items/:id', authentication, async (req, res) => {
    const _id = req.params.id
    try {

        const item = await Item.findOne({ _id, owner: req.user._id }).populate('owner')

        if (!item) {
            return res.status(404).send('Not found')

        }
        res.status(200).send(item)
    } catch (e) {
        res.status(500).send()
    }


})

router.patch('/items/:id', authentication, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'price']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates' })
    }

    try {
        const item = await Item.findOne({ _id: req.params.id, owner: req.user._id })

        if (!item) {
            return res.status(404).send()
        }

        updates.forEach((update) => item[update] = req.body[update])

        await item.save()
        res.send(item)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/items/:id', authentication, async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!item) {
            res.status(404).send()
        }

        res.send(item)
    } catch (e) {
        res.status(500).send()
    }
})


const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})
router.post('/items/images', authentication, upload.single('images'), async (req, res) => {
    req.item.images = req.file.buffer
    await req.item.save()
    res.send()
    
}), (error, req, res, next) => {
    res.status(400).send({ error: error.message })
}

module.exports = router