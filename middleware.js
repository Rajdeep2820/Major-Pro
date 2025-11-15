module.exports.isLoggedIn = (req,res,next) => {
    console.log(req.user);
    req.session.redirecURL = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error" , "Log in to create a new Listing.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirecURL = (req,res,next) => {
if(req.session.redirecURL){
    res.locals.redirectURL = req.session.redirecURL;
}
next();
}