require("dotenv").config()

// required packages
const express = require('express')
const rowdy = require('rowdy-logger')
const cookieParser = require("cookie-parser")
// app config
const PORT = process.env.PORT || 9000
const app = express()
app.set('view engine', 'ejs')
const db = require("./models")
const cryptoJS = require("crypto-js")

// middlewares
const rowdyRes = rowdy.begin(app)
app.use(require('express-ejs-layouts'))
// middleware for handling request bodies
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())



//listen
app.listen(PORT, function() {
    console.log(`🔥🔥🔥 VEGETA: ITS OVER ${PORT} 🔥🔥🔥`)
})