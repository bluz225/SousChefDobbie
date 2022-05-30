let express = require('express')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")
const axios = require("axios")

router.post("/search", async function (req, res) {
    try {
        // console.log(req.body.searchInput)
        const searchedRecipe = req.body.searchInput
        const searchURL = `https://api.spoonacular.com/recipes/complexSearch?query=${req.body.searchInput}&apiKey=${process.env.SPOON_API_KEY}&number=20`
        const searchResults = await axios.get(searchURL)
        // console.log(searchResults.data)

        res.render("recipes/searchByRecipes.ejs", { searchedRecipe, searchResults: searchResults.data.results })

    } catch (error) {
        console.warn(error)
    }
})

router.post("/view", async function (req, res) {
    // console.log(req.params.id)

    const searchedResult = JSON.parse(req.body.result)
    const viewRecipebyIdURL = `https://api.spoonacular.com/recipes/${searchedResult.id}/information?includeNutrition=false&apiKey=${process.env.SPOON_API_KEY}`    
    const viewRecipeResult = await axios.get(viewRecipebyIdURL)
    // console.log(viewRecipeResult.data)

    res.render("recipes/viewRecipe.ejs", { viewRecipeResult: viewRecipeResult.data,searchedResult })
})

router.post("/saved", async function (req, res) {
    try {
        const foundUser = await db.user.findOne({
            where: {
                id: res.locals.user.dataValues.id
            }
        })

        const recipeToSave = JSON.parse(req.body.recipe)
        const imgURL = JSON.parse(req.body.imgURL)
        
        console.log(imgURL)

        // create a new saved recipe
        const saveRecipe = await db.savedrecipe.create({
            title: recipeToSave.title,
            summary: recipeToSave.summary,
            imageurl: imgURL,
            instructions: recipeToSave.instructions,
            osrecipeId: recipeToSave.id,
            userId: res.locals.user.dataValues.id
        })
        
        // search for cuisine(s) and create
        recipeToSave.cuisines.forEach(async function(cuisine){
            const [searchCuisine,cuisineCreated] = await db.cuisine.findOrCreate({
                where: {
                    type: cuisine
                }
            })
            //link up cuisine with saved recipe
            saveRecipe.addCuisine(searchCuisine)
        })

        // ping USDA api per ingredient and find/create ingredient in ingredients table
        const ingredientsToSearch = recipeToSave.extendedIngredients
        for (i = 0; i < ingredientsToSearch.length; i++) {
            // check if ingredient has already been saved to ingredients table before
            let dbfoundIngredient = await db.ingredient.findOne({
                where: {
                    name: ingredientsToSearch[i].nameClean
                }
            })
            // if ingredient is not found
            if (!dbfoundIngredient) {
                //USDA API
                let usdaSearchURL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${ingredientsToSearch[i].nameClean}`
                let usdaIng = await axios.get(usdaSearchURL)
                usdaIng = usdaIng.data.foods[0]
                // console.log("fdcId:",usdaIng.fdcId)
                foodnutrients = usdaIng.foodNutrients
                // console.log(ingredientsToSearch[i].nameClean,":", usdaIng)
                // console.log(ingredientsToSearch[i].nameClean,":", foodnutrients)
                
                protein = foodnutrients.filter(nutrient => nutrient.nutrientNumber === '203')
                if (protein.length === 0) {
                    protein = `0 G`
                } else {
                    protein = `${protein[0].value} ${protein[0].unitName}`
                }
                
                carb = foodnutrients.filter(nutrient => nutrient.nutrientNumber === '205')
                if (carb.length === 0) {
                    carb = `0 G`
                } else {
                    carb = `${carb[0].value} ${carb[0].unitName}`
                }
                
                fat = foodnutrients.filter(nutrient => nutrient.nutrientNumber === '204')
                if (fat.length === 0) {
                    fat = `0 G`
                } else {
                    fat = `${fat[0].value} ${fat[0].unitName}`
                }
                
                calories = foodnutrients.filter(nutrient => nutrient.nutrientNumber === '208')
                if (calories.length === 0){
                    calories = `0 KCAL`
                } else {
                    calories = `${calories[0].value} ${calories[0].unitName}`
                }
                

                // findorcreate ingredient category
                // console.log("food category:", usdaIng.foodCategory)
                const [incat,foundincat] = await db.incat.findOrCreate({
                    where: {
                        type: usdaIng.foodCategory
                    }
                })
                
                //create ingredient in ingredients table
                let createIng = await db.ingredient.create({
                    name: ingredientsToSearch[i].nameClean,
                    protein: protein,
                    carb: carb,
                    calories: calories,
                    fat: fat,
                    brandName: usdaIng.brandName,
                    incatId:incat.id,
                    fdcIdId:usdaIng.fdcId,
                    gtinUpc: usdaIng.gtinUpc,
                    servingsize: usdaIng.servingSize,
                    servingsizeunit: usdaIng.servingSizeUnit
                })
                
                // attached ingredient to saved recipe M:M
                saveRecipe.addIngredient(createIng)
            } else {
                // attached ingredient to saved recipe M:M
                saveRecipe.addIngredient(dbfoundIngredient)              
            }
        }
        res.redirect("saved")
    } catch (error) {
        console.warn(error)
    }
})

router.get("/saved", async function(req,res){
    try {
        // original MVP working user-saved recipe setup
        // const allsavedrecipes = await db.user.findAll({
        //     where :{
        //         id: res.locals.user.dataValues.id
        //     },include:[db.savedrecipe]})


        const allsavedrecipes = await db.user.findAll({
            where :{
                id: res.locals.user.dataValues.id
            },include:[db.savedrecipe]})

            


        console.log(allsavedrecipes[0].dataValues.savedrecipes)
        res.render("recipes/savedRecipes.ejs", {allsavedrecipes:allsavedrecipes[0].dataValues.savedrecipes})
    } catch (error) {
        console.warn(error)
    }

})

module.exports = router