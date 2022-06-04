let express = require('express')
let db = require('../models')
let router = express.Router()
const cryptoJS = require("crypto-js")
const bcrpyt = require("bcryptjs")
const axios = require("axios")
const ingredient = require('../models/ingredient')
const { sequelize } = require('../models')
const { Op } = require("sequelize");
const { default: getModuleDependencies } = require('tailwindcss/lib/lib/getModuleDependencies')

router.post("/search", async function (req, res) {
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        }
        // console.log(req.body.searchInput)
        const searchedRecipe = req.body.searchInput
        const searchURL = `https://api.spoonacular.com/recipes/complexSearch?query=${req.body.searchInput}&apiKey=${process.env.SPOON_API_KEY}&number=20`
        const searchResults = await axios.get(searchURL)

        res.render("recipes/searchByRecipes.ejs", { searchedRecipe, searchResults: searchResults.data.results })

    } catch (error) {
        console.warn(error)
    }
})

router.post("/view", async function (req, res) {
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        }
        const searchedResult = JSON.parse(req.body.result)
        const viewRecipebyIdURL = `https://api.spoonacular.com/recipes/${searchedResult.id}/information?includeNutrition=false&apiKey=${process.env.SPOON_API_KEY}`
        const viewRecipeResult = await axios.get(viewRecipebyIdURL)
    
        res.render("recipes/viewRecipe.ejs", { viewRecipeResult: viewRecipeResult.data, searchedResult })
    } catch (error) {
        console.warn(error)
    }

})

router.post("/saved", async function (req, res) {
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        }
        // console.log(res.locals.user)
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

        console.warn("created recipe Id:", saveRecipe.dataValues.id)

        // search for cuisine(s) and create
        recipeToSave.cuisines.forEach(async function (cuisine) {
            const [searchCuisine, cuisineCreated] = await db.cuisine.findOrCreate({
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
                let usdaSearchURL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${ingredientsToSearch[i].nameClean}&pageSize=1`

                let usdaIng = await axios.get(usdaSearchURL)
                usdaIng = usdaIng.data.foods[0]
                // console.log("fdcId:",usdaIng.fdcId)
                let foodnutrients = usdaIng.foodNutrients
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
                if (calories.length === 0) {
                    calories = `0 KCAL`
                } else {
                    calories = `${calories[0].value} ${calories[0].unitName}`
                }


                // findorcreate ingredient category
                // console.log("food category:", usdaIng.foodCategory)
                const [incat, foundincat] = await db.incat.findOrCreate({
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
                    incatId: incat.id,
                    fdcIdId: usdaIng.fdcId,
                    gtinUpc: usdaIng.gtinUpc,
                    servingsize: usdaIng.servingSize,
                    servingsizeunit: usdaIng.servingSizeUnit
                })
                console.warn("ingredient name", ingredientsToSearch[i].name)
                console.warn("ingredient amt", ingredientsToSearch[i].amount)
                console.warn("ingredient unit", ingredientsToSearch[i].unit)
                console.warn("created ing Id", createIng.dataValues.id)

                const createAmountRec = await db.amount.create({
                    value: ingredientsToSearch[i].amount,
                    uom: ingredientsToSearch[i].unit,
                    savedrecipeId: saveRecipe.dataValues.id,
                    ingredientId: createIng.dataValues.id
                })

                // attached ingredient to saved recipe M:M
                saveRecipe.addIngredient(createIng)
            } else {
                // attached ingredient to saved recipe M:M
                saveRecipe.addIngredient(dbfoundIngredient)
                const createfoundAmountRec = await db.amount.create({
                    value: ingredientsToSearch[i].amount,
                    uom: ingredientsToSearch[i].unit,
                    savedrecipeId: saveRecipe.dataValues.id,
                    ingredientId: dbfoundIngredient.dataValues.id
                })
            }
        }
        res.redirect("saved")
    } catch (error) {
        console.warn(error)
    }
})





router.get("/saved", async function (req, res) {
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        }
        const allsavedrecipes = await db.user.findAll({
            where: {
                id: res.locals.user.dataValues.id
            }, include: [{
                all: true, nested: true
            }]
        })
        console.log(allsavedrecipes[0].dataValues.savedrecipes[0])
        res.render("recipes/savedRecipes.ejs", { allsavedrecipes: allsavedrecipes[0].dataValues.savedrecipes })
    } catch (error) {
        console.warn(error)
    }
})

router.delete("/saved/:id", async function (req, res) {
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        }

        
        console.log("saved recipe id:", req.params.id)
        let user = await db.user.findByPk(res.locals.user.dataValues.id)
        // user = JSON.parse(JSON.stringify(user))
        const recipe = await db.savedrecipe.findByPk(req.params.id)
        const ingredients = await db.ingredient.findAll()
        recipe.removeIngredient(ingredients)
    
        await db.savedrecipe.destroy({
            where: {
                id: req.params.id
            }
        })
    
        res.redirect("/recipes/saved")
    } catch (error) {
        console.warn(error)
    }
})

router.get("/editsaved/:id", async function (req, res) {
    try {
        const editRecipe = await db.savedrecipe.findOne({
            where: {    
                id: req.params.id
            }, include: [{
                all: true, nested: true
            }]
        })        

        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        }

        if (editRecipe.user.id != res.locals.user.dataValues.id){
            res.redirect("/profile")
            return
        }
        // console.log("recipe id:", req.params.id)

        const editRecipeJSON = JSON.parse(JSON.stringify(editRecipe))
        delete editRecipeJSON.user["id"]
        delete editRecipeJSON.user["password"]
        delete editRecipeJSON.user["createdAt"]
        delete editRecipeJSON.user["updatedAt"]
    
        // console.log(editRecipeJSON)
        res.render("recipes/editSavedRecipe.ejs", { recipedata: editRecipeJSON })
    } catch (error) {
        console.warn(error)
    }
    
   
})

router.put("/editsaved/", async function (req, res) {
    try {
        if (!res.locals.user){
            res.render("users/login.ejs", {msg: "please login to continue"})
            return
        }

        // updates title, summary and instructions
        const recipeToEdit = await db.savedrecipe.findByPk(req.body.recipeId)
        await recipeToEdit.set({
            title: req.body.title,
            summary: req.body.summary,
            instructions: req.body.instructions
        })
        await recipeToEdit.save()

        //remove cuisine linkages
        const cuisinesNotOnRecipe = await db.cuisine.findAll({
            attributes: ['id'],
            where: {
                id: {[Op.not]: req.body.existingcuisineId }
            }
        })

        console.log(cuisinesNotOnRecipe)
        
        if (cuisinesNotOnRecipe.length >0){
            for(i=0;i<cuisinesNotOnRecipe.length;i++) {
                const searchCuisinePk = await db.cuisine.findByPk(cuisinesNotOnRecipe[i].dataValues.id)
                recipeToEdit.removeCuisine(searchCuisinePk)
            }
        }

        //update cuisine name

        //add new cuisines


        const ingredientsNotOnRecipe = await db.ingredient.findAll({
            attributes: ['id'],
            where: {
                id: { [Op.not]: req.body.ingredientexistingredientId },

            }, include: {
                model: db.savedrecipe,
                where: {
                    id: req.body.recipeId
                }
            }
        })
        // need to add removal of linkage from saved recipe and delete amountId
        const currentRecipe = await db.savedrecipe.findByPk(req.body.recipeId)
        // removes link from ingredient to saved recipe and deletes the amount record
        if (ingredientsNotOnRecipe.length > 0) {
            for (i = 0; i < ingredientsNotOnRecipe.length; i++) {
                const searchIngredient = await db.ingredient.findByPk(ingredientsNotOnRecipe[i].dataValues.id)
                await currentRecipe.removeIngredient(searchIngredient)
                const amountToDestroy = await db.amount.findOne({
                    where: {
                        savedrecipeId: currentRecipe.dataValues.id,
                        ingredientId: searchIngredient.dataValues.id
                    }
                })
                await amountToDestroy.destroy()
            }
        }

        // update all ingredients amount/uom
        for (i = 0; i < req.body.ingredientexistingredientId.length; i++) {
            const amountToEdit = await db.amount.findByPk(req.body.ingredientexistamountId[i])
            await amountToEdit.set({
                value: req.body.ingredientexistamountvalue[i],
                uom: req.body.ingredientexistamountuom[i]
            })
            await amountToEdit.save()
        }

        // check if new ingredients exist and is an array, then add new ingredient(s) to recipe with new amount/uom
        if (req.body.ingredientnewname) {
            if (Array.isArray(req.body.ingredientnewname) === false) {
                let newIngNameArr = []
                let newAmtValueArr = []
                let newAmtUOMArr = []
                newIngNameArr.push(req.body.ingredientnewname)
                newAmtValueArr.push(Number(req.body.ingredientnewamountvalue))
                newAmtUOMArr.push(req.body.ingredientnewamountuom)
                req.body.ingredientnewname = newIngNameArr
                req.body.ingredientnewamountvalue = newAmtValueArr
                req.body.ingredientnewamountuom = newAmtUOMArr
            }
            
                for (i = 0; i < req.body.ingredientnewname.length; i++) {

                    const [Ingred, createdIngred] = await db.ingredient.findOrCreate({
                        where: {
                            name: req.body.ingredientnewname[i]
                        }
                    })
                    console.log("createdIngred:", createdIngred)
                    if (createdIngred) {
                        let usdaIng = await searchUSDA(req.body.ingredientnewname[i])
                        let foodnutrients = usdaIng.foodNutrients

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
                        if (calories.length === 0) {
                            calories = `0 KCAL`
                        } else {
                            calories = `${calories[0].value} ${calories[0].unitName}`
                        }

                        const [incat, foundincat] = await db.incat.findOrCreate({
                            where: {
                                type: usdaIng.foodCategory
                            }
                        })

                        //set ingredients with missing values
                        await Ingred.set({
                            protein: protein,
                            carb: carb,
                            calories: calories,
                            fat: fat,
                            brandName: usdaIng.brandName,
                            incatId: incat.id,
                            fdcIdId: usdaIng.fdcId,
                            gtinUpc: usdaIng.gtinUpc,
                            servingsize: usdaIng.servingSize,
                            servingsizeunit: usdaIng.servingSizeUnit
                        })
                        //save
                        await Ingred.save()
                        console.log("newIngAmt:", req.body.ingredientnewamountvalue[i])
                        const createfoundAmountRec = await db.amount.create({
                            value: req.body.ingredientnewamountvalue[i],
                            uom: req.body.ingredientnewamountuom[i],
                            savedrecipeId: req.body.recipeId,
                            ingredientId: Ingred.dataValues.id
                        })
                        await currentRecipe.addIngredient(Ingred)

                    } else {
                        await currentRecipe.addIngredient(Ingred)
                        const createfoundAmountRec = await db.amount.create({
                            value: req.body.ingredientnewamountvalue[i],
                            uom: req.body.ingredientnewamountuom[i],
                            savedrecipeId: req.body.recipeId,
                            ingredientId: Ingred.dataValues.id
                        })
                    }
                }
        }



        
        res.redirect(`/recipes/editsaved/${req.body.recipeId}`)
    } catch (error) {
        console.warn(error)
    }
})

module.exports = router

async function searchUSDA(searchTerm) {
    const searchUSDAurl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${searchTerm}&pageSize=1`
    const USDAsearchResults = await axios.get(searchUSDAurl)
    return USDAsearchResults.data.foods[0]
}