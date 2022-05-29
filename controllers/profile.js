let express = require('express')
// const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")
const cf = require("../customfunctions.js")

// show profile page route
router.get("/", function(req,res){
    cf.verifylogincookie(res,"profile/showprofile.ejs")
})

// edit profile route
router.get("/edit", function(req,res){
    cf.verifylogincookie(res,"profile/editprofile.ejs")
})

module.exports = router