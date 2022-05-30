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
    // console.log(req.params.id)

    const viewRecipebyIdURL = `https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=${process.env.SPOON_API_KEY}&number=5`
    const viewRecipeResult = await axios.get(viewRecipebyIdURL)
    console.log(viewRecipeResult.data.extendedIngredients)
    
    // res.render("recipes/viewRecipe.ejs",{viewRecipeResult:viewRecipeResult.data})
})

router.post("/saved", async function(req, res){
    try {
        const foundUser = await db.user.findOne({
            where: {
                id: res.locals.user.dataValues.id
            }
        })
        
        const recipeToSave = JSON.parse(req.body.recipe)
        // console.log(recipeToSave.extendedIngredients)
        // const saveRecipe = await db.savedrecipe.create({
        //     title: recipeToSave.title,
        //     summary: recipeToSave.summary,
        //     imageurl: recipeToSave.image,
        //     instructions: recipeToSave.instructions,
        //     osrecipeId: recipeToSave.id
        // })

        
        // ping USDA api per ingredient and find/create ingredient in ingredients table
        const ingredientsToSearch = recipeToSave.extendedIngredients
        let searchedIngArr = []
        for(i=0;i<ingredientsToSearch.length;i++){
            let usdaSearchURL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${ingredientsToSearch[i].nameClean}`
            let usdaIng = await axios.get(usdaSearchURL)
            usdaIng = usdaIng.data.foods[0]
            foodnutrients = usdaIng.foodNutrients
            const name = usdaIng.lowercaseDescription
            // nutrients = foodnutrients.filter(function(nutrient){
            //     return nutrient.nutrientNumber === "203" || nutrient.nutrientNumber === "204" || nutrient.nutrientNumber === "205" 
            // })
            protein = foodnutrients.filter(nutrient =>nutrient.nutrientNumber === "203")
            protein = `${protein[0].value} ${protein[0].unitName}`
            carb = foodnutrients.filter(nutrient =>nutrient.nutrientNumber === "205")
            carb = `${carb[0].value} ${carb[0].unitName}`
            calories = foodnutrients.filter(nutrient =>nutrient.nutrientNumber === "208")
            calories = `${calories[0].value} ${calories[0].unitName}`
            fat = foodnutrients.filter(nutrient =>nutrient.nutrientNumber === "204")
            fat = `${fat[0].value} ${fat[0].unitName}`
            
            console.log(`carb:${carb}, protein:${protein}`)
            // fat = 

            const ingredientObj = {
                name: name,
                protein: protein,
                carb: carb,
                calories: calories,
                fat: fat
            }
            searchedIngArr.push(ingredientObj)
            // console.log(usdaIng.data.foods[0])
            // console.log(ingredientsToSearch[i])
        }

        // console.log(searchedIngArr)
        
        // console.log(recipeToSave.extendedIngredients)
        res.render("recipes/savedRecipes.ejs")
    } catch (error) {
        console.warn(error)
    }
})

module.exports = router