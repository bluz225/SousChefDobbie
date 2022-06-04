const editRecipeIngredientsDiv = document.querySelector("#editRecipeIngredientsDiv")
const editRecipeAddIngredientBtn = document.querySelector("#editRecipeAddIngredientBtn")
const deleteIngredientBtn = document.querySelectorAll(".deleteIngredientBtn")

// DOM content loaded
document.addEventListener("DOMContentLoaded", function(){

    // adds event listener to all delete buttons that were generated in the ingredients element
    deleteIngredientBtn.forEach(function(btn, index){
        btn.addEventListener("click",function(e){
            recursivelyRemoveli(e,"div")
        })
    })
    // add event listener to call addNewIngredient function when "add ingredient button is pressed"
    editRecipeAddIngredientBtn.addEventListener("click",addNewIngredient)
})

// function that adds new li with nested ingredient name,amount,uom inputs + delete button
function addNewIngredient(){
    const ingredDiv = document.createElement("div")
    ingredDiv.setAttribute("class", "grid grid-cols-4 gap-2 auto-cols-min ml-5")

    const ingredNameInput = document.createElement("input")
    ingredNameInput.name = `ingredientnewname`
    ingredNameInput.required = true
    ingredNameInput.setAttribute("class","w-[10rem] border rounded-3xl")


    const ingredAmountInput = document.createElement("input")
    ingredAmountInput.name = `ingredientnewamountvalue`
    ingredAmountInput.required = true
    ingredAmountInput.setAttribute("class","text-center w-[5rem] border rounded-3xl")

    const ingredUomInput = document.createElement("input")
    ingredUomInput.name = `ingredientnewamountuom`
    ingredUomInput.required = true
    ingredUomInput.setAttribute("class","text-center w-[5rem] border rounded-3xl")

    const ingredRemoveBtn = document.createElement("button")
    ingredRemoveBtn.setAttribute("class","deleteIngredientBtn border rounded-3xl bg-slate-500 hover:bg-slate-400")
    ingredRemoveBtn.type = "button"
    ingredRemoveBtn.innerText = "Remove"
    ingredRemoveBtn.addEventListener("click",function(e){
        recursivelyRemoveli(e,"li")
    })

    ingredDiv.append(ingredNameInput,ingredAmountInput,ingredUomInput,ingredRemoveBtn)
    editRecipeIngredientsDiv.append(ingredDiv)
}

//function to recursively delete based on an event and the closest element (passed)
function recursivelyRemoveli(e,ele){
    e.target.closest(ele).remove()
}