const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize')

class Item extends Model {
    toJSON() {
        let attributes = Object.assign({}, this.get())
        delete attributes.owner.password
        return attributes
    }
}
Item.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            isNumeric: true,
            validate: {
                checkPrice(value) {
                    if (value < 0) {
                        throw new Error('Price must be a positive number ')
                    }
                }
            }
        },
    },
    {
        sequelize,
    }
)

module.exports = Item