const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const userController = require('../controller/user.js');



router
    .route("/signup")
    .get(userController.renderSignupform)
    .post(wrapAsync(userController.signup))

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(redirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), userController.login)

router.get("/logout", userController.logout)
module.exports = router;