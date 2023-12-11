const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/users.js")

router
.route("/signup")
.get( userController.renderSignup)
.post( wrapAsync(userController.signup));

router
.route("/login")
.get(userController.login)
.post(
saveRedirectUrl,
 passport.authenticate
 ("local", 
 {failureRedirect: '/login',
  failureFlash: true}),
  userController.logindone );



//logout route
router.get("/logout",userController.logout);

module.exports = router;                         
 

// short cut hai ctrl+j se terminal open hota hai 
