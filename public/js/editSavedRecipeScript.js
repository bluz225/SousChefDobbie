const editRecipeIngredientsUl = document.querySelector("#editRecipeIngredientsUl")
const editRecipeAddIngredientBtn = document.querySelector("#editRecipeAddIngredientBtn")
const deleteIngredientBtn = document.querySelectorAll(".deleteIngredientBtn")

document.addEventListener("DOMContentLoaded", function(){

    deleteIngredientBtn.forEach(function(btn, index){
        btn.addEventListener("click",function(e){
            recursivelyRemoveli(e)
        })
    })
    editRecipeAddIngredientBtn.addEventListener("click",addNewIngredient)


})

function addNewIngredient(){
    
    const newli = document.createElement("li")

    const ingredNameInput = document.createElement("input")
    ingredNameInput.name = `ingredientnewname`

    const ingredAmountInput = document.createElement("input")
    ingredAmountInput.name = `ingredientnewamountvalue`

    const ingredUomInput = document.createElement("input")
    ingredUomInput.name = `ingredientnewamountuom`

    const ingredRemoveBtn = document.createElement("button")
    ingredRemoveBtn.setAttribute("class","deleteIngredientBtn")
    ingredRemoveBtn.type = "button"
    ingredRemoveBtn.innerText = "Remove"
    ingredRemoveBtn.addEventListener("click",function(e){
        recursivelyRemoveli(e)
    })

    newli.append(ingredNameInput,ingredAmountInput,ingredUomInput,ingredRemoveBtn)
    editRecipeIngredientsUl.append(newli)
    
}

function recursivelyRemoveli(e){
    e.target.closest('li').remove()
}