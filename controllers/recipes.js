let express = require('express')
const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")

router.get("/search", function(req, res){


    res.render("searchByRecipies.ejs")
})

module.exports = router