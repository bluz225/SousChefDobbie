let express = require('express')
const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")

router.get("/", function(req,res){
    if (!res.locals.user){
        res.render("users/login.ejs", {msg: "please login to continue"})
        return
    } else {
        res.render("profile/showprofile.ejs")
    }
})

router.get("/edit", function(req,res){
    if (!res.locals.user){
        res.render("users/login.ejs", {msg: "please login to continue"})
        return
    } else {
        res.render("profile/editprofile.ejs")
    }
})

// function verifyLocalUser(){
//     if (!res.locals.user){
//         res.render("users/login.ejs", {msg: "please login to continue"})
//         return
//     } else {
//         res.render("profile/editprofile.ejs")
//     }
// }

module.exports = router