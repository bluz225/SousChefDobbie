let express = require('express')
const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")

router.get("/", function(req,res){
    res.render("profile/showprofile.ejs")
})

router.get("/edit", function(req,res){
    res.render("profile/editprofile.ejs")
})

module.exports = router