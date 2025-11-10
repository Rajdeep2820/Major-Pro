module.exports.isLoggedIn = (req,res,next) => {
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error" , "Log in to create a new Listing.");
        return res.redirect("/login");
    }
    next();
}