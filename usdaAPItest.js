
require("dotenv").config()
const axios = require("axios")

const foodArr =["peas", "carrots", "tuna", "tomato", "sour bread"]
const search = foodArr.join(",")
console.log(search)

const pagesize = 1000


let usdaSearchURL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${search}&pageSize=${pagesize}`

async function searchUSDA(){
    const results = await axios.get(usdaSearchURL)
    // console.log(results.data)
    // console.log(foodArr[0])
    const peasResults = results.data.foods.filter(item => item.lowercaseDescription === foodArr[0])
    console.log(peasResults)
}
searchUSDA()



