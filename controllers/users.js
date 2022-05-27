let express = require('express')
const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")

router.get("/login", function(req,res){
    res.render("users/login.ejs")
})

router.post("/login", function(req,res){

    res.redirect("/profile")
})

router.get("/signup", function(req,res){
    res.render("users/signup.ejs")
})

router.post("/signup", function(req,res){
    // res.render("profile/showprofile.ejs")
    res.redirect("/profile")
})

module.exports = router