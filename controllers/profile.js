let express = require('express')
// const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")
const { Op } = require("sequelize");

// show profile page route
router.get("/", async function(req,res){
    if (!res.locals.user){
        res.render("users/login.ejs", {msg: "please login to continue"})
        return
    } else {
        let allSavedRecipesOtherThan = await db.savedrecipe.findAll({
            where:{
                userId:{[Op.not]:`${res.locals.user.dataValues.id}`}
            }
        })
        allSavedRecipesOtherThan = JSON.parse(JSON.stringify(allSavedRecipesOtherThan))
        allSavedRecipesOtherThan.forEach(function(recipe){
            delete recipe["userId"]
        })
        
    // console.log(allSavedRecipesOtherThan)
        res.render("profile/showprofile.ejs", {allSavedRecipesOtherThan})
    }
})

// edit profile route
router.get("/edit", async function(req,res){
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        } else {
            let user = await db.user.findByPk(res.locals.user.dataValues.id)
            user = JSON.parse(JSON.stringify(user))
            delete user["id"]
            delete user["password"]
            delete user["createdAt"]
            delete user["updatedAt"]
            res.render("profile/editprofile.ejs",{user, msg: null})
        }
    } catch (error) {
        console.warn(error)
    }

})

// route to edit accout info
router.put("/edit", async function(req,res){
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        } else {
            let user = await db.user.findByPk(res.locals.user.dataValues.id)
            user.set({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            })
            await user.save()
            res.redirect("edit")

        }
    } catch (error) {
        console.warn(error)
    }  
})

// route to change the password
router.put("/changepassword", async function(req,res){
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        } else {
            let user = await db.user.findByPk(res.locals.user.dataValues.id)
            cleanuser = JSON.parse(JSON.stringify(user))
            delete cleanuser["id"]
            delete cleanuser["password"]
            delete cleanuser["createdAt"]
            delete cleanuser["updatedAt"]
            let msg
            const compare = bcrpyt.compareSync(req.body.cpw,user.password)
            if (compare){
                if (req.body.pw1 === req.body.pw2){
                    const hashedPassword = bcrpyt.hashSync(req.body.pw1, Number(process.env.SALT))
                    user.set({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password:hashedPassword
                    })
                    await user.save()
                    msg = "password has been changed"
                } else {
                    msg = "the new passwords are not the same, please try again"
                }                
            } else {
                msg = "the current password provided was incorrect, please try again"
            }
            res.redirect("edit")

        }
    } catch (error) {
        console.warn(error)
    }
    
})

module.exports = router