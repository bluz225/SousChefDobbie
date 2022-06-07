let express = require('express')
// const req = require('express/lib/request')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")
const { Op } = require("sequelize");
const axios = require("axios")

// show search results from API
router.get("/", async function (req, res) {
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        }
        // console.log(req.query.searchInput)
        // console.log(req.body.searchInput)
        const searchedRecipe = req.query.searchInput
        const searchURL = `https://api.spoonacular.com/recipes/complexSearch?query=${searchedRecipe}&apiKey=${process.env.SPOON_API_KEY}&number=20`
        const searchResults = await axios.get(searchURL)

        res.render("search/searchByRecipes.ejs", { searchedRecipe, searchResults: searchResults.data.results })

    } catch (error) {
        console.warn(error)
    }
})


// view recipe from API Search
router.get("/view", async function (req, res) {
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        }
        const searchedResult = JSON.parse(req.query.result)
        const viewRecipebyIdURL = `https://api.spoonacular.com/recipes/${searchedResult.id}/information?includeNutrition=false&apiKey=${process.env.SPOON_API_KEY}`
        const viewRecipeResult = await axios.get(viewRecipebyIdURL)
    
        res.render("search/viewSearchedRecipe.ejs", { viewRecipeResult: viewRecipeResult.data, searchedResult })
    } catch (error) {
        console.warn(error)
    }

})

module.exports = router