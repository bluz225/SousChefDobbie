let express = require('express')
const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")


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
            res.render("users/edit.ejs",{user, msg: null})
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

// login get routes
router.get("/login", function(req,res){
    res.render("users/login.ejs", {msg: null})
})

// login post route
router.post("/login", async function(req,res){
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
            res.redirect("/recipes/home")
        } else {
            res.render("users/login.ejs",{msg})
            return
        }
    } catch (error) {
        console.warn(error)
    }
})

// snew user get routes
router.get("/new", function(req,res){
    res.render("users/signup.ejs")
})

// new user post route
router.post("/new", async function(req,res){
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
            res.redirect("/recipes/home")
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
    res.redirect("login")
})

module.exports = router