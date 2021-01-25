const mongoose = require('mongoose')


const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,

    },
    price: {
        type: Number,
        default: 0,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Price must be a positive number ')
            }
        }
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image: {
        type: Buffer,
    },
}, {
    timestamps: true
})

itemSchema.methods.toJSON = function () {
    const item = this
    const itemObject = item.toObject()

    delete itemObject.owner._id
    delete itemObject.owner.password
    delete itemObject.owner.tokens
    delete itemObject._id

    return itemObject
}
const Item = mongoose.model('Item', itemSchema)

module.exports = Item