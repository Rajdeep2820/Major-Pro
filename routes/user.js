const express = require("express")
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirecURL } = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signup")
.get(userController.renderSignUpform)
.post(wrapAsync(userController.signUp))

router.route("/login")
.get(userController.renderLogInform)
.post(
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