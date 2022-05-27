let express = require('express')
const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")

// login routes
router.get("/login", function(req,res){
    res.render("users/login.ejs")
})

router.post("/login", async function(req,res){
    res.redirect("/profile")
})

// signup routes
router.get("/signup", function(req,res){
    res.render("users/signup.ejs")
})

router.post("/signup", async function(req,res){
    // res.render("profile/showprofile.ejs")
    try {
        
    } catch (error) {
        
    }

    res.redirect("/profile")
})

module.exports = router