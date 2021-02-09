const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Item = require('./items')

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize')


class User extends Model {
    static findByCredentials = async (email, password) => {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw new Error('Wrong email')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('Wrong password')
        }
        return user
    };

    toJSON() {
        let attributes = Object.assign({}, this.get())
        delete attributes.password
        attributes.mobile = attributes.mobile.slice(0, 4) + "xxxxxxxxx"
        return attributes
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: {
                    msg: "The name can only contain letters"
                },
                len: {
                    args: [2, 255],
                    msg: "The name has to be at least two characters"
                }
            },
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "The email must be a valid email"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 255],
                    msg: "The password must be at least 6 characters long"
                }
            }

        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [13]
            }
        },

    },
    {

        hooks: {
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            },
        },
        sequelize,
        timestamps: false,
    }
)

User.generateAuthToken = async function (userId) {
    const token = jwt.sign({ id: userId }, 'thisismynewtoken')
    return token
}

User.hasMany(Item, { onDelete: 'cascade', foreignKey: 'owner' })

module.exports = User;
