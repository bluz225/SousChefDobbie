let express = require('express')
const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")

// login get routes
router.get("/login", function(req,res){
    res.render("users/login.ejs", {msg: null})
})

// login post route
router.post("/login", async function(req,res){
    // res.redirect("/profile")

    try {
        // look up the user in the db based on their emails
        const foundUser = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        const msg = "bad login credentials, you are not authenticated!"
        // if the user is not found, display the login form and give them a message
        if (!foundUser) {
            console.log("email not found on")
            res.render("users/login.ejs",{msg})
            return // do not continue with the function
        }
        // otherwise, authenticate the user with provided password from database
        // hash the password from the req.body and compare it to the db password

        const compare = bcrpyt.compareSync(req.body.password,foundUser.password)
        if (compare) {
            const encryptedId = cryptoJS.AES.encrypt(foundUser.id.toString(), process.env.ENC_KEY).toString()
            res.cookie("userId", encryptedId)
            res.redirect("/profile")
        } else {
            res.render("users/login.ejs",{msg})
            return
        }
    } catch (error) {
        console.warn(error)
    }
})

// signup get routes
router.get("/signup", function(req,res){
    res.render("users/signup.ejs")
})

// signup post route
router.post("/signup", async function(req,res){
    // res.render("profile/showprofile.ejs")
    try {
        //hash password
        const hashedPassword = bcrpyt.hashSync(req.body.password, Number(process.env.SALT))
        //find or create new user
        const [user, userCreated] = await db.user.findOrCreate({
            where: {
                email:req.body.email
            }, defaults: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hashedPassword
            }
        })

        // check if a new user was created
        if (userCreated) {
            const encryptedId = cryptoJS.AES.encrypt(user.id.toString(), process.env.ENC_KEY).toString()
            res.cookie("userId", encryptedId)
            res.redirect("/profile")
        } else {
            res.render("users/login.ejs", {msg: "email exists in database already 🤦‍♂️"})
        }
    } catch (error) {
        console.warn(error)
    }
})

// logout route
router.get("/logout",(req,res)=>{
    // clear the cookie from storage
    // redirect to root
    res.clearCookie("userId")
    res.render("users/login.ejs", {msg:null})
    
})

module.exports = router