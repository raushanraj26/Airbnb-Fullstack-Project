const express = require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport =require("passport");
const { savedRedirectUrl } = require("../midlleware.js");
const userController=require("../controllers/users.js");


//render sihnup form
router.get('/signup',userController.renderSignupForm);

//post route
router.post("/signup",wrapAsync(userController.signup) );



//login user form
router.get("/login",userController.renderLoginForm)



// for user authenticate->read passport npm document
// Passport provides an authenticate() function, which is used as route middleware to authenticate requests.


//user authenticate then loogin user
router.post('/login', savedRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true,}),
    userController.loginUser
);

router.get("/logout",userController.logout)





module.exports=router;

