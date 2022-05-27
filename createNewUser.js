const db = require("./models")

let email = "guest@guest.com"
let firstName = "guest"
let lastName = "guest"
let password = "guest"

async function createNewUser(email,firstName,lastName,password) {
    try {
        const [newUser, newUserCreated] = await db.user.findOrCreate({
            where: {
                email:email
            }, defaults: {
                firstName: firstName,
                lastName: lastName,
                password: password
            }
        })
        console.log("newUser:",newUser)
        console.log("newUserCreated:",newUserCreated)
    } catch (error) {
      console.warn(error)  
    } 
}

createNewUser(email,firstName,lastName,password)