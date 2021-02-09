const express = require('express')
const userRouter = require('./routes/user')
const itemRouter = require('./routes/item')
const app = express()
const port = process.env.PORT || 3000

const sequelize = require('./database/sequelize')

app.use(express.json())
app.use(userRouter)
app.use(itemRouter)

const main = async function () {
    await sequelize.sync({ force: true })
    console.log("The table for the User and Item models was just (re)created!")
}
main();

app.listen(port, () => {
    console.log('Server is up on port' + port)
})











