let express = require('express')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")
const axios = require("axios")

router.post("/search", async function(req, res){
    try {
            // console.log(req.body.searchInput)
    const searchedRecipe = req.body.searchInput
    const searchURL = `https://api.spoonacular.com/recipes/complexSearch?query=pasta&apiKey=${process.env.SPOON_API_KEY}&number=5`
    const searchResults = await axios.get(searchURL)
    console.log(searchResults.data)

    res.render("recipes/searchByRecipes.ejs", {searchedRecipe,searchResults:searchResults.data.results})
    
    } catch (error) {
        console.warn(error)
    }
})

router.get("/view/:id", async function(req, res){
    console.log(req.params.id)

    const viewRecipebyIdURL = `https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=${process.env.SPOON_API_KEY}&number=5`
    const viewRecipeResult = await axios.get(viewRecipebyIdURL)
    // console.log(viewRecipeResult.data)
    
    res.render("recipes/viewRecipe.ejs",{viewRecipeResult:viewRecipeResult.data})
})

router.get("/saved", function(req, res){

    res.render("recipes/savedRecipes.ejs")
})

module.exports = router