const editRecipeIngredientsUl = document.querySelector("#editRecipeIngredientsUl")
const editRecipeAddIngredientBtn = document.querySelector("#editRecipeAddIngredientBtn")

let ingredIndex = 0

document.addEventListener("DOMContentLoaded", function(){
    console.log("herro")
    editRecipeAddIngredientBtn.addEventListener("click",function(){
        const newli = document.createElement("li")
        const ingredNameInput = document.createElement("input")
        ingredNameInput.name = `ingredientnew${ingredIndex}Name`
        const ingredAmountInput = document.createElement("input")
        ingredAmountInput.name = `ingredientnew${ingredIndex}/amountvalue`
        const ingredUomInput = document.createElement("input")
        ingredUomInput.name = `ingredientnew${ingredIndex}/amountuom`
        editRecipeIngredientsUl.append(newli,ingredNameInput,ingredAmountInput,ingredUomInput)
        console.log("clicked")
        ingredIndex += 1
    })
})