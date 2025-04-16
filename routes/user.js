const express = require("express");
const router = express.Router();
const wrapAsync = require("../utiles/wrapAsync");
const passport = require("passport");
const { saveRegisterUrl } = require("../middleware");
const UserController = require("../controllers/user")


 router.route("/signup")
.get( UserController.renderSignup)
.post(wrapAsync( UserController.Singup));


router.route("/login")
.get(  UserController.renderLogin)
.post( saveRegisterUrl , passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}) , UserController.login)


router.get("/logout" , UserController.logout)


module.exports =router;