const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://localhost:3306/shop', {
    dialect: "mysql",
    username: "shop",
    password: "",
    logging: false,

});

module.exports = sequelize;