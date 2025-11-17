const express = require("express")
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirecURL } = require("../middleware.js");
const userController = require("../controller/user.js");

router.get("/signup", userController.renderSignUpform);

router.post("/signup", wrapAsync(userController.signUp));

router.get("/login", userController.renderLogInform);

router.post("/login",
    saveRedirecURL,
    passport.authenticate("local",
        {
            failureRedirect: '/login',
            failureFlash: true
        }),
        userController.login
);

router.get("/logout", userController.logout);


module.exports = router;