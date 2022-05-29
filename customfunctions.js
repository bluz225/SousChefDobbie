module.exports.verifylogincookie = function(res,ejspath) {
    if (!res.locals.user){
        res.render("users/login.ejs", {msg: "please login to continue"})
        return
    } else {
        res.render(ejspath)
    }

}