let express = require('express')
// const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")
const { Op } = require("sequelize");

// show profile page route


module.exports = router