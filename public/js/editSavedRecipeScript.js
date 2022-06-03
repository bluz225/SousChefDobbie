const editRecipeIngredientsUl = document.querySelector("#editRecipeIngredientsUl")
const editRecipeAddIngredientBtn = document.querySelector("#editRecipeAddIngredientBtn")
const deleteIngredientBtn = document.querySelectorAll(".deleteIngredientBtn")

// DOM content loaded
document.addEventListener("DOMContentLoaded", function(){

    // adds event listener to all delete buttons that were generated in the ingredients element
    deleteIngredientBtn.forEach(function(btn, index){
        btn.addEventListener("click",function(e){
            recursivelyRemoveli(e,"li")
        })
    })
    // add event listener to call addNewIngredient function when "add ingredient button is pressed"
    editRecipeAddIngredientBtn.addEventListener("click",addNewIngredient)
})

// function that adds new li with nested ingredient name,amount,uom inputs + delete button
function addNewIngredient(){
    const newli = document.createElement("li")

    const ingredNameInput = document.createElement("input")
    ingredNameInput.name = `ingredientnewname`
    ingredNameInput.required = true

    const ingredAmountInput = document.createElement("input")
    ingredAmountInput.name = `ingredientnewamountvalue`
    ingredAmountInput.required = true

    const ingredUomInput = document.createElement("input")
    ingredUomInput.name = `ingredientnewamountuom`
    ingredUomInput.required = true

    const ingredRemoveBtn = document.createElement("button")
    ingredRemoveBtn.setAttribute("class","deleteIngredientBtn")
    ingredRemoveBtn.type = "button"
    ingredRemoveBtn.innerText = "Remove"
    ingredRemoveBtn.addEventListener("click",function(e){
        recursivelyRemoveli(e,"li")
    })

    newli.append(ingredNameInput,ingredAmountInput,ingredUomInput,ingredRemoveBtn)
    editRecipeIngredientsUl.append(newli)
}

//function to recursively delete based on an event and the closest element (passed)
function recursivelyRemoveli(e,ele){
    e.target.closest(ele).remove()
}