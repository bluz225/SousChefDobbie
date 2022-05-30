let db = require('./models')

async function runme(){
    try {
        const [incat,foundincat] = await db.incat.findOrCreate({
            where: {
                type: "milk"
            }
        })
    } catch (error) {
        
    }
}

runme()