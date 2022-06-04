const editRecipeIngredientsDiv = document.querySelector("#editRecipeIngredientsDiv")
const editRecipeAddIngredientBtn = document.querySelector("#editRecipeAddIngredientBtn")
const deleteIngredientBtn = document.querySelectorAll(".deleteIngredientBtn")

const editCuisinesDiv = document.querySelector("#editCuisinesDiv")
const editRecipeAddCuisineBtn = document.querySelector("#editRecipeAddCuisineBtn")
const deleteCusineBtn = document.querySelectorAll(".deleteCusineBtn")

// DOM content loaded
document.addEventListener("DOMContentLoaded", function(){
    console.log(deleteIngredientBtn)
    // adds event listener to all delete buttons that were generated in the ingredients element
    deleteIngredientBtn.forEach(function(btn, index){
        console.log("ingreident delete button was pushed")
        btn.addEventListener("click",function(e){
            recursivelyRemoveEle(e,"div")
        })
    })
    // add event listener to call addNewIngredient function when "add ingredient button is pressed"
    editRecipeAddIngredientBtn.addEventListener("click",addNewIngredient)

    console.log(deleteCusineBtn)
    deleteCusineBtn.forEach(function(btn, index){
        console.log("cuisine delete button was pushed")
        btn.addEventListener("click",function(e){
            recursivelyRemoveEle(e,"div")
        })
    })

    editRecipeAddCuisineBtn.addEventListener("click",addNewCuisine)


})

function addNewCuisine(){
    const cuisineDiv = document.createElement("div")
    cuisineDiv.setAttribute("class", "ml-5 grid grid-cols-2 gap=2 w-[30rem]")
    
    const cuisineTypeInput = document.createElement("input")
    cuisineTypeInput.name =`newcuisinetype`
    cuisineTypeInput.required = true
    cuisineTypeInput.setAttribute("class", "w-[15rem] text-center border rounded-3xl")

    const cuisineRemoveBtn = document.createElement("button")
    cuisineRemoveBtn.setAttribute("class","border w-[10rem] rounded-3xl bg-slate-500 hover:bg-slate-400")
    cuisineRemoveBtn.type = "button"
    cuisineRemoveBtn.innerText = "Remove"
    cuisineRemoveBtn.addEventListener("click",function(e){
        recursivelyRemoveEle(e,"div")
    })

    cuisineDiv.append(cuisineTypeInput,cuisineRemoveBtn)
    editCuisinesDiv.append(cuisineDiv)

}

// function that adds new li with nested ingredient name,amount,uom inputs + delete button
function addNewIngredient(){
    const ingredDiv = document.createElement("div")
    ingredDiv.setAttribute("class", "w-[35rem] grid grid-cols-4 gap-2 auto-cols-min ml-5")

    const ingredNameInput = document.createElement("input")
    ingredNameInput.name = `ingredientnewname`
    ingredNameInput.required = true
    ingredNameInput.setAttribute("class","w-[8rem] border rounded-3xl")


    const ingredAmountInput = document.createElement("input")
    ingredAmountInput.name = `ingredientnewamountvalue`
    ingredAmountInput.required = true
    ingredAmountInput.setAttribute("class","text-center w-[5rem] border rounded-3xl")

    const ingredUomInput = document.createElement("input")
    ingredUomInput.name = `ingredientnewamountuom`
    ingredUomInput.required = true
    ingredUomInput.setAttribute("class","text-center w-[5rem] border rounded-3xl")

    const ingredRemoveBtn = document.createElement("button")
    ingredRemoveBtn.setAttribute("class","w-[10rem] deleteIngredientBtn border rounded-3xl bg-slate-500 hover:bg-slate-400")
    ingredRemoveBtn.type = "button"
    ingredRemoveBtn.innerText = "Remove"
    ingredRemoveBtn.addEventListener("click",function(e){
        recursivelyRemoveEle(e,"div")
    })

    ingredDiv.append(ingredNameInput,ingredAmountInput,ingredUomInput,ingredRemoveBtn)
    editRecipeIngredientsDiv.append(ingredDiv)
}

//function to recursively delete based on an event and the closest element (passed)
function recursivelyRemoveEle(e,ele){
    e.target.closest(ele).remove()
}