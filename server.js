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

//auth middlware
app.use( async (req,res,next)=>{
    try {
      if (req.cookies.userId) {
        const userId = req.cookies.userId
        const decryptedId = cryptoJS.AES.decrypt(userId,process.env.ENC_KEY).toString(cryptoJS.enc.Utf8)
        const user = await db.user.findByPk(decryptedId)
        res.locals.user = user
      } else {
        res.locals.user = null
      }
    } catch (error) {
      console.warn(error)
    }  finally {
      next()
    }
  })


//render home page
app.get("/", function(req,res){
    res.render("index.ejs")
})

// controller middleware
app.use('/users', require('./controllers/users'))
app.use('/profile', require('./controllers/profile'))
app.use('/recipes', require('./controllers/recipes'))

//listen to port
app.listen(PORT, function() {
    console.log(`🔥🔥🔥 VEGETA: ITS OVER ${PORT} 🔥🔥🔥`)
})